<template>
  <div :style="{ width: 'inherit', height: 'inherit' }">
    <DocumentEditor
      v-if="ready"
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
    ></DocumentEditor>
    <notifications position="top center"></notifications>
  </div>
</template>

<script lang="ts">
import DocumentEditor from './components/DocumentEditor.vue';

export default {
  name: 'office-editor',
  components: {
    DocumentEditor,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    config: {
      type: Object,
      required: true,
    },
    api: {
      type: Object,
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
      ready: false,
      docEditor: undefined,
    };
  },

  mounted() {
    if (
      this.config === undefined ||
      this.id === undefined ||
      this.api === undefined
    ) {
      this.$notify({
        type: 'error',
        text: "require 'config', 'id', 'api' properties must not null ",
      });
    } else {
      this.ready = true;
    }
  },

  destroyed() {
    this.triggerDocumentBeforeDestroy();
  },

  methods: {
    loadHistoryList() {
      this.api
        .loadHistoryList?.()
        .then((data) => {
          this.docEditor?.refreshHistory?.(data);
        })
        .catch((err) => {
          console.log('Failed to load history.', err);
          this.$notify({ type: 'error', text: 'Failed load history.' });
        });
    },

    loadHistoryData(version) {
      this.api
        .loadHistoryData?.(version)
        .then((data) => {
          this.docEditor?.setHistoryData?.(data);
        })
        .catch((err) => {
          console.error('Failed load history data.', err);
          this.$notify({ type: 'error', text: 'Failed load history data.' });
        });
    },

    // ------------------------- trigger method -------------------------

    triggerRequestRename(e) {
      this.printEvent('onRequestRename', e);
      const { newfilename } = e.data;
      this.api
        .triggerRename?.(newfilename)
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
      const docEditor = window.DocEditor?.instances[this.id];
      if (docEditor) {
        docEditor.triggerForceSave = (callback) => {
          this.printEvent('triggerForceSave');
          this.api
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
          this.printEvent('triggerKickout');
          this.api
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
          this.printEvent('triggerKickoutOthers');
          this.api
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
          this.printEvent('triggerKickoutAll');
          this.api
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
          this.printEvent('onlineDocUser');
          this.api
            .triggerOnlineDocUser?.()
            .then((data) => {
              callback?.(data || [], undefined);
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
      this.api
        .triggerRestore?.(version)
        .then((success) => {
          if (success) {
            this.loadHistoryList();
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
