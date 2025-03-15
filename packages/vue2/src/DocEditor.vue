<template>
  <div>
    <notifications v-if="config == null" position="top center"></notifications>
    <office-editor
      v-else
      :id="id"
      :api="api"
      :width="width"
      :height="height"
      :config="config"
      :printLog="printLog"
      :onDocumentReady="onDocumentReady"
      :onLoadComponentError="onLoadComponentError"
      :onMetaChange="onMetaChange"
      :onInfo="onInfo"
      :onWarning="onWarning"
      :onError="onError"
      :onRequestSharingSettings="onRequestSharingSettings"
      :onRequestRename="onRequestRename"
      :onMakeActionLink="onMakeActionLink"
      :onRequestInsertImage="onRequestInsertImage"
      :onRequestMailMergeRecipients="onRequestMailMergeRecipients"
      :onRequestCompareFile="onRequestCompareFile"
      :onRequestEditRights="onRequestEditRights"
      :onRequestHistory="onRequestHistory"
      :onRequestHistoryData="onRequestHistoryData"
      :onRequestHistoryClose="onRequestHistoryClose"
      :onRequestRestore="onRequestRestore"
      :onDocumentStateChange="onDocumentStateChange"
      :onDocumentBeforeDestroy="onDocumentBeforeDestroy"
    >
    </office-editor>
  </div>
</template>

<script lang="ts">
import OfficeEditor from './OfficeEditor.vue';
import useRequest from './hook/useRequest';
import useDocApi from './services/doc';
import { useEditorApi } from './services/editor';

export default {
  name: 'doc-editor',
  components: {
    OfficeEditor,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    docUrl: {
      type: String,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
    cipher: {
      type: String,
      required: true,
    },
    printLog: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: '100%',
    },
    width: {
      type: String,
      default: '100%',
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
    const request = useRequest(this.docUrl, this.user, this.cipher);
    const docApi = useDocApi(request);
    const editorApi = useEditorApi(request);

    return {
      config: null,
      docApi,
      editorApi,
      api: {
        loadHistoryList: () => {
          return docApi.getHistory(this.id).then((res) => {
            const { code, data, message } = res;
            if (code === 200) {
              return data;
            } else {
              throw new Error(message);
            }
          });
        },
        loadHistoryData: (version) => {
          return docApi.getHistoryData(this.id, version).then((res) => {
            const { code, data, message } = res;
            if (code === 200) {
              return data;
            } else {
              throw new Error(message);
            }
          });
        },
        triggerForceSave: () => {
          return docApi.forceSave(this.id).then((res) => {
            const { data, code, message } = res;
            if (code === 200 && data) {
              return true;
            } else {
              throw new Error(message);
            }
          });
        },
        triggerKickout: (userIds) => {
          return docApi.kickout(this.id, userIds).then((res) => {
            const { code, data, message } = res;
            if (code === 200 && data) {
              return true;
            } else {
              throw new Error(message);
            }
          });
        },
        triggerKickoutOthers: () => {
          return docApi.kickoutOthers(this.id).then((res) => {
            const { code, data, message } = res;
            if (code === 200 && data) {
              return true;
            } else {
              throw new Error(message);
            }
          });
        },
        triggerKickoutAll: () => {
          return docApi.kickoutAll(this.id).then((res) => {
            const { code, data, message } = res;
            if (code === 200 && data) {
              return true;
            } else {
              return Promise.reject(new Error(message));
            }
          });
        },
        triggerOnlineDocUser: () => {
          return docApi.getOnlineDocUser(this.id).then((res) => {
            const { code, data, message } = res;
            if (code === 200) {
              return data;
            } else {
              throw new Error(message);
            }
          });
        },
        triggerRestore: (version) => {
          return docApi.restore(this.id, version).then((res) => {
            const { code, message } = res;
            if (code === 200) {
              return true;
            } else {
              return Promise.reject(message);
            }
          });
        },
        triggerRename: (newfilename) => {
          return docApi
            .rename(this.id, { newfilename, ext: '' })
            .then((res) => {
              const { code, message } = res;
              if (code === 200) {
                return true;
              } else {
                throw new Error(message);
              }
            });
        },
      },
    };
  },

  mounted() {
    this.editorApi
      .editor(this.id)
      .then((res) => {
        const { code, data, message } = res;
        if (code === 200) {
          this.config = data;
        } else {
          this.$notify({ type: 'error', text: message });
        }
      })
      .catch((err) => this.$notify({ type: 'error', text: err }));
  },
};
</script>
