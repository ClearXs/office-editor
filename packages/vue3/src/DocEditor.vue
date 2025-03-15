<template>
  <notifications v-if="config == null" position="top center"></notifications>
  <OfficeEditor
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
  </OfficeEditor>
</template>

<script lang="ts">
import { Component, defineComponent, onMounted, PropType, ref } from 'vue';
import { useNotification, Notifications } from '@kyvg/vue3-notification';
import type {
  DocumentEditorConfig,
  DocUser,
  IOfficeEditorProps,
} from './interface';
import OfficeEditor from './OfficeEditor.vue';
import useRequest from './hook/useRequest';
import useDocApi from './services/doc';
import { useEditorApi } from './services/editor';

export default defineComponent({
  name: 'doc-editor',
  components: {
    Notifications,
    OfficeEditor: OfficeEditor as unknown as Component,
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
      type: Object as PropType<DocUser>,
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

    const request = useRequest(props.docUrl, props.user, props.cipher);
    const docApi = useDocApi(request);
    const editorApi = useEditorApi(request);

    const config = ref<DocumentEditorConfig>();
    const api = ref<IOfficeEditorProps['api']>({
      loadHistoryList() {
        return docApi.getHistory(props.id).then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            return data;
          } else {
            throw new Error(message);
          }
        });
      },
      loadHistoryData(version) {
        return docApi.getHistoryData(props.id, version).then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            return data;
          } else {
            throw new Error(message);
          }
        });
      },
      triggerForceSave() {
        return docApi.forceSave(props.id).then((res) => {
          const { data, code, message } = res;
          if (code === 200 && data) {
            return true;
          } else {
            throw new Error(message);
          }
        });
      },
      triggerKickout(userIds) {
        return docApi.kickout(props.id, userIds).then((res) => {
          const { code, data, message } = res;
          if (code === 200 && data) {
            return true;
          } else {
            throw new Error(message);
          }
        });
      },
      triggerKickoutOthers() {
        return docApi.kickoutOthers(props.id).then((res) => {
          const { code, data, message } = res;
          if (code === 200 && data) {
            return true;
          } else {
            throw new Error(message);
          }
        });
      },
      triggerKickoutAll() {
        return docApi.kickoutAll(props.id).then((res) => {
          const { code, data, message } = res;
          if (code === 200 && data) {
            return true;
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      triggerOnlineDocUser() {
        return docApi.getOnlineDocUser(props.id).then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            return data;
          } else {
            throw new Error(message);
          }
        });
      },
      triggerRestore(version) {
        return docApi.restore(props.id, version).then((res) => {
          const { code, message } = res;
          if (code === 200) {
            return true;
          } else {
            return Promise.reject(message);
          }
        });
      },
      triggerRename(newfilename) {
        return docApi.rename(props.id, { newfilename, ext: '' }).then((res) => {
          const { code, message } = res;
          if (code === 200) {
            return true;
          } else {
            throw new Error(message);
          }
        });
      },
    });

    onMounted(() => {
      editorApi
        .editor(props.id)
        .then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            config.value = data;
          } else {
            notify({ type: 'error', text: message });
          }
        })
        .catch((err) => notify({ type: 'error', text: err }));
    });

    return {
      config,
      api,
    };
  },
});
</script>
