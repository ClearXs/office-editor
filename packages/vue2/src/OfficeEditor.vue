<template>
  <div :style="{ width: 'inherit', height: 'inherit' }">
    <DocumentEditor
      v-if="documentConfig !== undefined"
      :id="docId"
      :width="width"
      :height="height"
      :config="documentConfig.model"
      :documentServerUrl="documentConfig.documentServerUrl"
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
    ></DocumentEditor>
    <notifications position="top center"></notifications>
  </div>
</template>

<script lang="ts">
import DocumentEditor from './components/DocumentEditor.vue';
import { useEditorApi } from './api/editor';
import useDocApi from './api/doc';

const editorApi = useEditorApi();
const docApi = useDocApi();

export default {
  name: 'office-editor',
  components: {
    DocumentEditor,
  },
  props: {
    docId: {
      type: String,
      required: true,
    },
    height: {
      type: String,
      default: '100%',
    },
    width: {
      type: String,
      default: '100%',
    },
    action: {
      type: Object,
      default: 'edit',
    },
    type: {
      type: Object,
      default: 'desktop',
    },
    config: {
      type: Object,
      default: {
        logo: undefined,
        plugins: true,
        integrationMode: 'embed',
        spellcheck: true,
        unit: 'cm',
        hideNotes: false,
        zoom: 100,
      },
    },
    printLog: {
      type: Boolean,
      default: true,
    },
    onDocumentReady: {
      type: Function,
    },
    onLoadComponentError: {
      type: Function,
    },
    onMetaChange: {
      type: Function,
    },
    onInfo: {
      type: Function,
    },
    onWarning: {
      type: Function,
    },
    onError: {
      type: Function,
    },
    onRequestSharingSettings: {
      type: Function,
    },
    onRequestRename: {
      type: Function,
    },
    onMakeActionLink: {
      type: Function,
    },
    onRequestInsertImage: {
      type: Function,
    },
    onRequestMailMergeRecipients: {
      type: Function,
    },
    onRequestCompareFile: {
      type: Function,
    },
    onRequestEditRights: {
      type: Function,
    },
    onRequestHistory: {
      type: Function,
    },
    onRequestHistoryData: {
      type: Function,
    },
    onRequestHistoryClose: {
      type: Function,
    },
    onRequestRestore: {
      type: Function,
    },
    onDocumentStateChange: {
      type: Function,
    },
    onDocumentBeforeDestroy: {
      type: Function,
    },
  },

  data() {
    return {
      documentConfig: undefined,
      docEditor: undefined,
    };
  },

  mounted() {
    this.loadDocumentConfig();
  },

  destroyed() {
    this.triggerDocumentBeforeDestroy();
  },

  methods: {
    loadDocumentConfig() {
      editorApi
        .editor(this.docId, this.action, this.type)
        .then((res) => {
          const { code, result, message } = res;
          if (code === 200) {
            const documentConfig = { ...result };
            const docConfig = { ...documentConfig.model };
            const editorConfig = docConfig.editorConfig || {};
            editorConfig.customization = {
              ...(editorConfig?.customization || {}),
              ...this.config,
              logo:
                this.config?.logo !== undefined
                  ? this.config.logo
                  : editorConfig.customization?.logo,
            };
            docConfig.editorConfig = editorConfig;
            console.log('load editor config is: ', documentConfig);
            this.documentConfig = documentConfig;
          } else {
            this.$notify({ type: 'error', text: message });
          }
        })
        .catch((err) => {
          console.error('Failed to get document config', err);
        });
    },

    loadHistoryList() {
      docApi
        .getHistory(this.docId)
        .then((res) => {
          const { code, result, message } = res;
          if (code === 200) {
            this.docEditor?.refreshHistory?.(result);
          } else {
            this.$notify({ type: 'error', text: message });
          }
        })
        .catch((err) => {
          console.log('Failed to load history.', err);
          this.$notify({ type: 'error', text: 'Failed load history.' });
        });
    },

    loadHistoryData(version) {
      docApi
        .getHistoryData(this.docId, version)
        .then((res) => {
          const { code, result, message } = res;
          if (code === 200) {
            this.docEditor?.setHistoryData?.(result);
          } else {
            this.$notify({ type: 'error', text: message });
          }
        })
        .catch((err) => {
          console.error('Failed load history data.', err);
          this.$notify({ type: 'error', text: 'Failed load history data.' });
        });
    },

    // ------------------------- trigger method -------------------------

    triggerRequestRename(e) {
      this.printEvent('onRequestRename', e);
      docApi
        .rename(this.docId, { newfilename: e.data })
        .then()
        .catch((err) => {
          console.error('Failed rename doc', err);
        })
        .finally(() => {
          this.onRequestRename?.(e);
        });
    },

    triggerDocumentReady() {
      this.printEvent('onDocumentReady');
      const docEditor = window.DocEditor?.instances[this.docId];
      if (docEditor) {
        docEditor.triggerForceSave = (callback) => {
          this.printEvent('triggerForceSave');
          docApi
            .forceSave(this.docId)
            .then((res) => {
              const { result, code } = res;
              if (code === 200 && result) {
                console.log('force save success');
              } else {
                console.error('Failed force save, the result is', res);
              }
              callback?.(result, undefined);
            })
            .catch((err) => {
              callback?.(false, undefined);
              console.error('Failed force save.', err);
            });
        };

        docEditor.triggerKickout = (userIds, callback) => {
          this.printEvent('triggerKickout');
          docApi
            .kickout(this.docId, userIds)
            .then((res) => {
              const { code, result } = res;
              if (code === 200 && result) {
                console.log('kickout success');
              } else {
                console.error('Failed kickout, the result is', res);
              }
              callback?.(result, undefined);
            })
            .catch((err) => {
              console.error('Failed kickout.', err);
              callback?.(false, err);
            });
        };

        docEditor.triggerKickoutOthers = (callback) => {
          this.printEvent('triggerKickoutOthers');
          docApi
            .kickoutAll(this.docId)
            .then((res) => {
              const { code, result } = res;
              if (code === 200 && result) {
                console.log('kickout others success');
              } else {
                console.error('Failed kickout others, the result is', res);
              }
              callback?.(result, undefined);
            })
            .catch((err) => {
              console.error('Failed kickout others.', err);
              callback?.(false, err);
            });
        };

        docEditor.triggerKickoutAll = (callback) => {
          this.printEvent('triggerKickoutAll');
          docApi
            .kickoutAll(this.docId)
            .then((res) => {
              const { code, result } = res;
              if (code === 200 && result) {
                console.log('kickout all success');
              } else {
                console.error('Failed kickout all, the result is', res);
              }
              callback?.(result, undefined);
            })
            .catch((err) => {
              console.error('Failed kickout all.', err);
              callback?.(false, err);
            });
        };

        docEditor.onlineDocUser = (callback) => {
          this.printEvent('onlineDocUser');
          docApi
            .getOnlineDocUser(this.docId)
            .then((res) => {
              const { code, result } = res;
              if (code === 200) {
                console.log('get online doc user success');
              } else {
                console.error(
                  'Failed get online doc user , the result is',
                  res
                );
              }
              callback?.(result || [], undefined);
            })
            .catch((err) => {
              console.error('Failed get online doc user .', err);
              callback?.([], err);
            });
        };
        this.onDocumentReady?.(docEditor);
      }
      this.docEditor = docEditor;
    },

    triggerLoadComponentError(error, errorDescription) {
      this.printEvent('onLoadComponentError', error, errorDescription);
      this.onLoadComponentError?.(error, errorDescription);
    },

    triggerRequestSharingSettings(e) {
      this.printEvent('onRequestSharingSettings', e);
      this.onRequestSharingSettings?.(e);
    },

    triggerMakeActionLink(e) {
      this.printEvent('onMakeActionLink', e);
      this.onMakeActionLink?.(e);
    },

    triggerRequestInsertImage(e) {
      this.printEvent('onRequestInsertImage', e);
      this.onRequestInsertImage?.(e);
    },

    triggerRequestMailMergeRecipients(e) {
      this.printEvent('onRequestMailMergeRecipients', e);
      this.onRequestMailMergeRecipients?.(e);
    },

    triggerRequestCompareFile(e) {
      this.printEvent('onRequestCompareFile', e);
      this.onRequestCompareFile?.(e);
    },

    triggerRequestEditRights(e) {
      this.printEvent('onRequestEditRights', e);
      this.onRequestEditRights?.(e);
    },

    triggerDocumentBeforeDestroy() {
      this.printEvent('onDocumentBeforeDestroy');
      this.onDocumentBeforeDestroy?.();
    },

    triggerRequestHistoryData(e) {
      this.printEvent('onRequestHistoryData', e);
      const version = e.data;
      this.loadHistoryData(version);
      this.onRequestHistoryData?.(version);
    },

    triggerMetaChange(e) {
      this.printEvent('onMetaChange', e);
      this.onMetaChange?.(e);
    },

    triggerDocumentStateChange(e) {
      this.printEvent('onDocumentStateChange', e);
      this.onDocumentStateChange?.(e);
    },

    triggerRequestHistory(e) {
      this.printEvent('onRequestHistory', e);
      this.loadHistoryList();
      this.onRequestHistory?.();
    },

    triggerRequestRestore(e) {
      this.printEvent('onRequestRestore', e);
      const { version } = e.data;
      docApi
        .restore(this.docId, version)
        .then((res) => {
          const { code, success, message } = res;
          if (code === 200 && success) {
            // load history
            this.loadHistoryList();
          } else {
            this.$notify({ type: 'error', text: message });
          }
        })
        .catch((err) => {
          console.error('Failed restore document version', err);
        })
        .finally(() => {
          this.onRequestRestore?.(e);
        });
    },

    triggerInfo(e) {
      this.printEvent('onInfo', e);
      this.onInfo?.(e);
    },

    triggerWarning(e) {
      this.printEvent('onWarning', e);
      this.onWarning?.(e);
    },

    triggerError(e) {
      this.printEvent('onError', e);
      this.onError?.(e);
    },

    triggerRequestHistoryClose(e) {
      this.printEvent('onRequestHistoryClose', e);
      document.location.reload();
      this.onRequestHistoryClose?.();
    },

    printEvent(event, ...args) {
      this.printLog &&
        console.log('document trigger event: %s,', event, 'args is: ', ...args);
    },
  },
};
</script>
