import { DocumentEditor } from '@onlyoffice/document-editor-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DocumentEditorConfig, useEditorApi } from './api/editor';
import { IEditor } from './model/config';
import useDocApi from './api/doc';
import { IOfficeEditorProps } from './interface';
import { ProgressBar } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toast';

const OfficeEditor: React.FC<IOfficeEditorProps> = ({
  docId,
  printLog = false,
  height = '100%',
  width = '100%',
  action = 'edit',
  type = 'desktop',
  config = {
    logo: undefined,
    plugins: true,
    integrationMode: 'embed',
    spellcheck: true,
    unit: 'cm',
    hideNotes: false,
    zoom: 100,
  },
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
  const [documentConfig, setDocumentConfig] = useState<DocumentEditorConfig>();

  const editorApi = useEditorApi();
  const docApi = useDocApi();
  const docEditorRef = useRef<IEditor>();

  useEffect(() => {
    loadDocumentConfig();
    return () => {
      triggerDocumentBeforeDestroy();
    };
  }, [docId]);

  const loadDocumentConfig = useCallback(() => {
    editorApi
      .editor(docId, action, type)
      .then((res) => {
        const { code, data, message } = res;
        if (code === 200) {
          const documentConfig = { ...data };
          const docConfig = { ...documentConfig.model };
          const editorConfig = docConfig.editorConfig || {};
          editorConfig.customization = {
            ...(editorConfig?.customization || {}),
            ...config,
            logo:
              config.logo !== undefined
                ? config.logo
                : editorConfig.customization?.logo,
          };
          docConfig.editorConfig = editorConfig;
          console.log('load editor config is: ', documentConfig);
          setDocumentConfig(documentConfig);
        } else {
          toast.error(message);
        }
      })
      .catch((err) => {
        console.error('Failed to get document config', err);
      });
  }, [docId]);

  const printEvent = useCallback(
    (event: keyof IOfficeEditorProps | keyof IEditor, ...args: any) => {
      printLog &&
        console.log('document trigger event: %s,', event, 'args is: ', ...args);
    },
    [docId]
  );

  const loadHistoryList = useCallback(() => {
    docApi
      .getHistory(docId)
      .then((res) => {
        const { code, data, message } = res;
        if (code === 200) {
          docEditorRef.current?.refreshHistory?.(data);
        } else {
          toast.error(message);
        }
      })
      .catch((err) => {
        console.log('Failed to load history.', err);
        toast.error('Failed load history.');
      });
  }, [docId]);

  const loadHistoryData = useCallback(
    (version: number) => {
      docApi
        .getHistoryData(docId, version)
        .then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            docEditorRef.current?.setHistoryData?.(data);
          } else {
            toast.error(message);
          }
        })
        .catch((err) => {
          console.error('Failed load history data.', err);
          toast.error('Failed load history data.');
        });
    },
    [docId]
  );

  const triggerDocumentReady = () => {
    printEvent('onDocumentReady');

    const docEditor = window.DocEditor.instances[docId] as IEditor;

    docEditor.triggerForceSave = (callback) => {
      printEvent('triggerForceSave');
      docApi
        .forceSave(docId)
        .then((res) => {
          const { data, code } = res;
          if (code === 200 && data) {
            console.log('force save success');
          } else {
            console.error('Failed force save, the result is', res);
          }
          callback?.(data, undefined);
        })
        .catch((err) => {
          callback?.(false, undefined);
          console.error('Failed force save.', err);
        });
    };

    docEditor.triggerKickout = (userIds, callback) => {
      printEvent('triggerKickout');
      docApi
        .kickout(docId, userIds)
        .then((res) => {
          const { code, data } = res;
          if (code === 200 && data) {
            console.log('kickout success');
          } else {
            console.error('Failed kickout, the result is', res);
          }
          callback?.(data, undefined);
        })
        .catch((err) => {
          console.error('Failed kickout.', err);
          callback?.(false, err);
        });
    };

    docEditor.triggerKickoutOthers = (callback) => {
      printEvent('triggerKickoutOthers');
      docApi
        .kickoutAll(docId)
        .then((res) => {
          const { code, data } = res;
          if (code === 200 && data) {
            console.log('kickout others success');
          } else {
            console.error('Failed kickout others, the result is', res);
          }
          callback?.(data, undefined);
        })
        .catch((err) => {
          console.error('Failed kickout others.', err);
          callback?.(false, err);
        });
    };

    docEditor.triggerKickoutAll = (callback) => {
      printEvent('triggerKickoutAll');
      docApi
        .kickoutAll(docId)
        .then((res) => {
          const { code, data } = res;
          if (code === 200 && data) {
            console.log('kickout all success');
          } else {
            console.error('Failed kickout all, the result is', res);
          }
          callback?.(data, undefined);
        })
        .catch((err) => {
          console.error('Failed kickout all.', err);
          callback?.(false, err);
        });
    };

    docEditor.onlineDocUser = (callback) => {
      printEvent('onlineDocUser');
      docApi
        .getOnlineDocUser(docId)
        .then((res) => {
          const { code, data } = res;
          if (code === 200) {
            console.log('get online doc user success');
          } else {
            console.error('Failed get online doc user , the result is', res);
          }
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

    docApi
      .restore(docId, version)
      .then((res) => {
        const { code, message } = res;
        if (code === 200) {
          // load history
          loadHistoryList();
        } else {
          toast.error(message);
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
    docApi
      .rename(docId, { newfilename: e.data })
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
    document.location.reload();
    onRequestHistoryClose?.();
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
      {documentConfig !== undefined ? (
        <DocumentEditor
          id={docId}
          width={width}
          height={height}
          config={documentConfig.model}
          documentServerUrl={documentConfig.documentServerUrl}
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
      ) : (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ProgressBar
            visible={true}
            height='120'
            width='120'
            ariaLabel='progress-bar-loading'
          />
        </div>
      )}
      <ToastContainer position='bottom-center' />
    </>
  );
};

export default OfficeEditor;
