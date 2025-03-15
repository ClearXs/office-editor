<template>
  <div :style="{ width: 'inherit', height: 'inherit' }">
    <document-editor
      v-if="readyRef"
      :id="id"
      :width="width"
      :height="height"
      :config="config.model"
      :documentServerUrl="config.documentServerUrl"
      :events_onDocumentReady="triggerDocumentReady"
      :onLoadComponentError="triggerLoadComponentError"
      :events_onRequestHistoryData="triggerRequestHistoryData"
      :events_onMetaChange="triggerMetaChange"
      :events_onDocumentStateChange="triggerDocumentStateChange"
      :events_onRequestHistory="triggerRequestHistory"
      :events_onRequestRestore="triggerRequestRestore"
      :events_onRequestRename="triggerRequestRename"
      :events_onInfo="triggerInfo"
      :events_onWarning="triggerWarning"
      :events_onError="triggerError"
      :events_onRequestHistoryClose="triggerRequestHistoryClose"
      :events_onRequestSharingSettings="triggerRequestSharingSettings"
      :events_onMakeActionLink="triggerMakeActionLink"
      :events_onRequestInsertImage="triggerRequestInsertImage"
      :events_onRequestMailMergeRecipients="triggerRequestMailMergeRecipients"
      :events_onRequestCompareFile="triggerRequestCompareFile"
      :events_onRequestEditRights="triggerRequestEditRights"
    >
    </document-editor>
    <notifications position="top center"></notifications>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, PropType, ref } from 'vue';
import {
  DocumentEditorConfig,
  IEditorApi,
  IOfficeEditorProps,
} from './interface';
import { DocumentEditor } from '@onlyoffice/document-editor-vue';
import type { IEditor } from './model/config';
import { useNotification, Notifications } from '@kyvg/vue3-notification';

export default defineComponent({
  name: 'office-editor',
  components: {
    DocumentEditor,
    Notifications,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    config: {
      type: Object as PropType<DocumentEditorConfig>,
      required: true,
    },
    api: {
      type: Object as PropType<IEditorApi>,
      required: true,
    },
    width: {
      type: [String, Number],
      default: '100%',
    },
    height: {
      type: [String, Number],
      default: '100%',
    },
    printLog: {
      type: Boolean,
      default: true,
    },
    onDocumentReady: Function as PropType<
      IOfficeEditorProps['onDocumentReady']
    >,
    onLoadComponentError: Function as PropType<
      IOfficeEditorProps['onLoadComponentError']
    >,
    onMetaChange: Function as PropType<IOfficeEditorProps['onMetaChange']>,
    onInfo: Function as PropType<IOfficeEditorProps['onInfo']>,
    onWarning: Function as PropType<IOfficeEditorProps['onWarning']>,
    onError: Function as PropType<IOfficeEditorProps['onError']>,
    onRequestSharingSettings: Function as PropType<
      IOfficeEditorProps['onRequestSharingSettings']
    >,
    onRequestRename: Function as PropType<
      IOfficeEditorProps['onRequestRename']
    >,
    onMakeActionLink: Function as PropType<
      IOfficeEditorProps['onMakeActionLink']
    >,
    onRequestInsertImage: Function as PropType<
      IOfficeEditorProps['onRequestInsertImage']
    >,
    onRequestMailMergeRecipients: Function as PropType<
      IOfficeEditorProps['onRequestMailMergeRecipients']
    >,
    onRequestCompareFile: Function as PropType<
      IOfficeEditorProps['onRequestCompareFile']
    >,
    onRequestEditRights: Function as PropType<
      IOfficeEditorProps['onRequestEditRights']
    >,
    onRequestHistory: Function as PropType<
      IOfficeEditorProps['onRequestHistory']
    >,
    onRequestHistoryData: Function as PropType<
      IOfficeEditorProps['onRequestHistoryData']
    >,
    onRequestHistoryClose: Function as PropType<
      IOfficeEditorProps['onRequestHistoryClose']
    >,
    onRequestRestore: Function as PropType<
      IOfficeEditorProps['onRequestRestore']
    >,
    onDocumentStateChange: Function as PropType<
      IOfficeEditorProps['onDocumentStateChange']
    >,
    onDocumentBeforeDestroy: Function as PropType<
      IOfficeEditorProps['onDocumentBeforeDestroy']
    >,
  },
  setup(props) {
    const { notify } = useNotification();
    const docEditorRef = ref<IEditor | undefined>();
    const readyRef = ref<boolean>(false);

    const api: IEditorApi = props.api;

    onMounted(() => {
      // pre valid check
      if (
        props.config === undefined ||
        props.id === undefined ||
        api === undefined
      ) {
        notify({
          type: 'error',
          text: "require 'config', 'id', 'api' properties must not null ",
        });
      } else {
        readyRef.value = true;
      }
    });

    onUnmounted(() => {
      triggerDocumentBeforeDestroy();
    });

    const loadHistoryList = () => {
      api
        .loadHistoryList?.()
        .then((data) => {
          docEditorRef.value?.refreshHistory?.(data);
        })
        .catch((err) => {
          console.log('Failed to load history.', err);
          notify({ type: 'error', text: 'Failed load history.' });
        });
    };

    const loadHistoryData = (version: number) => {
      api
        .loadHistoryData?.(version)
        .then((data) => {
          docEditorRef.value?.setHistoryData?.(data);
        })
        .catch((err) => {
          console.error('Failed load history data.', err);
          notify({ type: 'error', text: 'Failed load history data.' });
        });
    };

    // ------------------------- trigger method -------------------------

    const triggerRequestRename = (e: Record<string, any>) => {
      printEvent('onRequestRename', e);
      const { newfilename } = e.data;
      api
        .triggerRename?.(newfilename)
        .then()
        .catch((err) => {
          console.error('Failed rename doc', err);
          notify({ type: 'error', text: 'Failed rename doc.' + err });
        })
        .finally(() => {
          props.onRequestRename?.(e);
        });
    };

    const triggerDocumentReady = () => {
      printEvent('onDocumentReady');
      const docEditor: IEditor = window.DocEditor?.instances[props.id];
      if (docEditor) {
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
              notify({ type: 'error', text: 'Failed force save.' + err });
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
              notify({ type: 'error', text: 'Failed kickout.' + err });
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
              notify({ type: 'error', text: 'Failed kickout others.' + err });
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
              notify({ type: 'error', text: 'Failed kickout all.' + err });
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
              console.error('Failed get online doc user.', err);
              callback?.([], err);
              notify({
                type: 'error',
                text: 'Failed get online doc user.' + err,
              });
            });
        };
        props.onDocumentReady?.(docEditor);
      }
      docEditorRef.value = docEditor;
    };

    const triggerLoadComponentError = (
      error: number,
      errorDescription: string
    ) => {
      printEvent('onLoadComponentError', error, errorDescription);
      props.onLoadComponentError?.(error, errorDescription);
    };

    const triggerRequestSharingSettings = (e: Record<string, any>) => {
      printEvent('onRequestSharingSettings', e);
      props.onRequestSharingSettings?.(e);
    };

    const triggerMakeActionLink = (e: Record<string, any>) => {
      printEvent('onMakeActionLink', e);
      props.onMakeActionLink?.(e);
    };

    const triggerRequestInsertImage = (e: Record<string, any>) => {
      printEvent('onRequestInsertImage', e);
      props.onRequestInsertImage?.(e);
    };

    const triggerRequestMailMergeRecipients = (e: Record<string, any>) => {
      printEvent('onRequestMailMergeRecipients', e);
      props.onRequestMailMergeRecipients?.(e);
    };

    const triggerRequestCompareFile = (e: Record<string, any>) => {
      printEvent('onRequestCompareFile', e);
      props.onRequestCompareFile?.(e);
    };

    const triggerRequestEditRights = (e: Record<string, any>) => {
      printEvent('onRequestEditRights', e);
      props.onRequestEditRights?.(e);
    };

    const triggerDocumentBeforeDestroy = () => {
      printEvent('onDocumentBeforeDestroy');
      props.onDocumentBeforeDestroy?.();
    };

    const triggerRequestHistoryData = (e: Record<string, any>) => {
      printEvent('onRequestHistoryData', e);
      const version = e.data;
      loadHistoryData(version);
      props.onRequestHistoryData?.(version);
    };

    const triggerMetaChange = (e: Record<string, any>) => {
      printEvent('onMetaChange', e);
      props.onMetaChange?.(e);
    };

    const triggerDocumentStateChange = (e: Record<string, any>) => {
      printEvent('onDocumentStateChange', e);
      props.onDocumentStateChange?.(e);
    };

    const triggerRequestHistory = (e: Record<string, any>) => {
      printEvent('onRequestHistory', e);
      loadHistoryList();
      props.onRequestHistory?.();
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
        .catch((err: Error) => {
          console.error('Failed restore document version', err);
        })
        .finally(() => {
          props.onRequestRestore?.(e);
        });
    };

    const triggerInfo = (e: Record<string, any>) => {
      printEvent('onInfo', e);
      props.onInfo?.(e);
    };

    const triggerWarning = (e: Record<string, any>) => {
      printEvent('onWarning', e);
      props.onWarning?.(e);
    };

    const triggerError = (e: Record<string, any>) => {
      printEvent('onError', e);
      props.onError?.(e);
    };

    const triggerRequestHistoryClose = (e: Record<string, any>) => {
      printEvent('onRequestHistoryClose', e);
      if (props.onRequestHistoryClose) {
        props.onRequestHistoryClose();
      } else {
        document.location.reload();
      }
    };

    const printEvent = (
      event: keyof IOfficeEditorProps | keyof IEditor,
      ...args: any
    ) => {
      props.printLog &&
        console.log('document trigger event: %s,', event, 'args is: ', ...args);
    };

    return {
      readyRef,
      triggerDocumentReady,
      triggerLoadComponentError,
      triggerRequestHistoryData,
      triggerMetaChange,
      triggerDocumentStateChange,
      triggerRequestHistory,
      triggerRequestRestore,
      triggerRequestRename,
      triggerInfo,
      triggerWarning,
      triggerError,
      triggerRequestHistoryClose,
      triggerRequestSharingSettings,
      triggerMakeActionLink,
      triggerRequestInsertImage,
      triggerRequestMailMergeRecipients,
      triggerRequestCompareFile,
      triggerRequestEditRights,
    };
  },
});
</script>
