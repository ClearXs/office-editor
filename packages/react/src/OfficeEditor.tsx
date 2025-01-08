import { DocumentEditor } from '@onlyoffice/document-editor-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IEditor } from './model/config';
import { IOfficeEditorProps } from './interface';
import { ToastContainer, toast } from 'react-toast';

const OfficeEditor: React.FC<IOfficeEditorProps> = ({
  id,
  config,
  api,
  printLog = false,
  height = '100%',
  width = '100%',
  onDocumentReady,
  onLoadComponentError,
  onMetaChange,
  onInfo,
  onWarning,
  onError,
  onRequestSharingSettings,
  onRequestRename,
  onMakeActionLink,
  onRequestInsertImage,
  onRequestMailMergeRecipients,
  onRequestCompareFile,
  onRequestEditRights,
  onRequestHistory,
  onRequestHistoryData,
  onRequestHistoryClose,
  onRequestRestore,
  onDocumentStateChange,
  onDocumentBeforeDestroy,
}) => {
  const docEditorRef = useRef<IEditor | undefined>(undefined);
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    // pre valid check
    if (config === undefined || id === undefined || api === undefined) {
      toast.error("require 'config', 'id', 'api' properties must not null ");
    } else {
      setReady(true);
    }
    return () => {
      triggerDocumentBeforeDestroy();
    };
  }, [id]);

  const printEvent = useCallback(
    (event: keyof IOfficeEditorProps | keyof IEditor, ...args: any) => {
      printLog &&
        console.log('document trigger event: %s,', event, 'args is: ', ...args);
    },
    [id]
  );

  const loadHistoryList = useCallback(() => {
    api
      .loadHistoryList?.()
      .then((data) => {
        docEditorRef.current?.refreshHistory?.(data);
      })
      .catch((err) => {
        console.log('Failed to load history.', err);
        toast.error('Failed load history.');
      });
  }, [id]);

  const loadHistoryData = useCallback(
    (version: number) => {
      api
        .loadHistoryData?.(version)
        .then((data) => {
          docEditorRef.current?.setHistoryData?.(data);
        })
        .catch((err) => {
          console.error('Failed load history data.', err);
          toast.error('Failed load history data.');
        });
    },
    [id]
  );

  const triggerDocumentReady = () => {
    printEvent('onDocumentReady');

    const docEditor = window.DocEditor.instances[id] as IEditor;

    docEditor.triggerForceSave = (callback) => {
      printEvent('triggerForceSave');
      api
        .triggerForceSave?.()
        .then((success) => {
          callback?.(success, undefined);
        })
        .catch((err) => {
          callback?.(false, err);
          console.error('Failed force save.', err);
        });
    };

    docEditor.triggerKickout = (userIds, callback) => {
      printEvent('triggerKickout');
      api
        .triggerKickout?.(userIds)
        .then((success) => {
          callback?.(success, undefined);
        })
        .catch((err) => {
          console.error('Failed kickout.', err);
          callback?.(false, err);
        });
    };

    docEditor.triggerKickoutOthers = (callback) => {
      printEvent('triggerKickoutOthers');
      api
        .triggerKickoutOthers?.()
        .then((success) => {
          callback?.(success, undefined);
        })
        .catch((err) => {
          console.error('Failed kickout others.', err);
          callback?.(false, err);
        });
    };

    docEditor.triggerKickoutAll = (callback) => {
      printEvent('triggerKickoutAll');
      api
        .triggerKickoutAll?.()
        .then((success) => {
          callback?.(success, undefined);
        })
        .catch((err) => {
          console.error('Failed kickout all.', err);
          callback?.(false, err);
        });
    };

    docEditor.onlineDocUser = (callback) => {
      printEvent('onlineDocUser');
      api
        .triggerOnlineDocUser?.()
        .then((data) => {
          callback?.(data || [], undefined);
        })
        .catch((err) => {
          console.error('Failed get online doc user .', err);
          callback?.([], err);
        });
    };

    docEditorRef.current = docEditor as IEditor;
    onDocumentReady?.(docEditor);
  };

  const triggerRequestHistoryData = (e: Record<string, any>) => {
    printEvent('onRequestHistoryData', e);
    const version = e.data as number;
    loadHistoryData(version);
    onRequestHistoryData?.(version);
  };

  const triggerMetaChange = (e: Record<string, any>) => {
    printEvent('onMetaChange', e);
    onMetaChange?.(e);
  };

  const triggerDocumentStateChange = (e: Record<string, any>) => {
    printEvent('onDocumentStateChange', e);
    onDocumentStateChange?.(e);
  };

  const triggerRequestHistory = (e: Record<string, any>) => {
    printEvent('onRequestHistory', e);
    loadHistoryList();
    onRequestHistory?.();
  };

  const triggerRequestRestore = (e: Record<string, any>) => {
    printEvent('onRequestRestore', e);
    const { version } = e.data;
    api
      .triggerRestore?.(version)
      .then((success) => {
        if (success) {
          loadHistoryList();
        }
      })
      .catch((err) => {
        console.error('Failed restore document version', err);
      })
      .finally(() => {
        onRequestRestore?.(e);
      });
  };

  const triggerRequestRename = (e: Record<string, any>) => {
    printEvent('onRequestRename', e);
    const { newfilename } = e.data;
    api
      .triggerRename?.(newfilename)
      .then()
      .catch((err) => {
        console.error('Failed rename doc', err);
      })
      .finally(() => {
        onRequestRename?.(e);
      });
  };

  const triggerInfo = (e: Record<string, any>) => {
    printEvent('onInfo', e);
    onInfo?.(e);
  };

  const triggerWarning = (e: Record<string, any>) => {
    printEvent('onWarning', e);
    onWarning?.(e);
  };

  const triggerError = (e: Record<string, any>) => {
    printEvent('onError', e);
    onError?.(e);
  };

  const triggerRequestHistoryClose = (e: Record<string, any>) => {
    printEvent('onRequestHistoryClose', e);
    if (onRequestHistoryClose) {
      onRequestHistoryClose();
    } else {
      document.location.reload();
    }
  };

  const triggerLoadComponentError = (
    error: number,
    errorDescription: string
  ) => {
    printEvent('onLoadComponentError', error, errorDescription);
    onLoadComponentError?.(error, errorDescription);
  };

  const triggerRequestSharingSettings = (e: Record<string, any>) => {
    printEvent('onRequestSharingSettings', e);
    onRequestSharingSettings?.(e);
  };

  const triggerMakeActionLink = (e: Record<string, any>) => {
    printEvent('onMakeActionLink', e);
    onMakeActionLink?.(e);
  };

  const triggerRequestInsertImage = (e: Record<string, any>) => {
    printEvent('onRequestInsertImage', e);
    onRequestInsertImage?.(e);
  };

  const triggerRequestMailMergeRecipients = (e: Record<string, any>) => {
    printEvent('onRequestMailMergeRecipients', e);
    onRequestMailMergeRecipients?.(e);
  };

  const triggerRequestCompareFile = (e: Record<string, any>) => {
    printEvent('onRequestCompareFile', e);
    onRequestCompareFile?.(e);
  };

  const triggerRequestEditRights = (e: Record<string, any>) => {
    printEvent('onRequestEditRights', e);
    onRequestEditRights?.(e);
  };

  const triggerDocumentBeforeDestroy = () => {
    printEvent('onDocumentBeforeDestroy');
    onDocumentBeforeDestroy?.();
  };

  return (
    <>
      {ready && (
        <DocumentEditor
          id={id}
          width={width}
          height={height}
          config={config.model}
          documentServerUrl={config.documentServerUrl}
          events_onDocumentReady={triggerDocumentReady}
          onLoadComponentError={triggerLoadComponentError}
          events_onRequestHistoryData={triggerRequestHistoryData}
          events_onMetaChange={triggerMetaChange}
          events_onDocumentStateChange={triggerDocumentStateChange}
          events_onRequestHistory={triggerRequestHistory}
          events_onRequestRestore={triggerRequestRestore}
          events_onRequestRename={triggerRequestRename}
          events_onInfo={triggerInfo}
          events_onWarning={triggerWarning}
          events_onError={triggerError}
          events_onRequestHistoryClose={triggerRequestHistoryClose}
          events_onRequestSharingSettings={triggerRequestSharingSettings}
          events_onMakeActionLink={triggerMakeActionLink}
          events_onRequestInsertImage={triggerRequestInsertImage}
          events_onRequestMailMergeRecipients={
            triggerRequestMailMergeRecipients
          }
          events_onRequestCompareFile={triggerRequestCompareFile}
          events_onRequestEditRights={triggerRequestEditRights}
        />
      )}
      <ToastContainer position='bottom-center' />
    </>
  );
};

export default OfficeEditor;
