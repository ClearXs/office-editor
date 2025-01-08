<template>
  <div
    class="w-[100vw] h-[100vh]"
    v-if="docId !== undefined && configRef !== undefined"
  >
    <n-space class="absolute">
      <n-button @click="editorRef?.triggerKickout?.(['1'])" type="primary">
        踢出
      </n-button>
      <n-button @click="editorRef?.triggerKickoutAll()" type="primary">
        踢出所有人
      </n-button>
      <n-button @click="editorRef?.triggerKickoutOthers()" type="primary">
        踢出其他人
      </n-button>
      <n-button @click="editorRef?.triggerForceSave()" type="primary">
        强制保存
      </n-button>
      <n-button @click="onlineDocUser" type="primary"> 在线用户 </n-button>
    </n-space>
    <office-editor
      :id="docId"
      :api="internalApiRef"
      :config="configRef"
      :onDocumentReady="onDocumentReady"
      :onDocumentBeforeDestroy="onDocumentBeforeDestroy"
    >
    </office-editor>
  </div>
</template>

<script lang="ts" setup>
import useDocApi from '@/api/doc';
import { useEditorApi } from '@/api/editor';
import {
  OfficeEditor,
  type DocumentEditorConfig,
  type IEditor,
  type IEditorApi,
} from '@clearx/office-editor-vue3';
import { useMessage } from 'naive-ui';
import { onBeforeMount, onMounted, ref } from 'vue';

const props = withDefaults(defineProps<{ docId: string }>(), {
  docId: undefined,
});

const docApi = useDocApi();
const editorApi = useEditorApi();

const messageApi = useMessage();
const editorRef = ref<IEditor | undefined>();
const configRef = ref<DocumentEditorConfig>();
const internalApiRef = ref<IEditorApi>();

onBeforeMount(() => {
  internalApiRef.value = {
    loadHistoryList() {
      return docApi.getHistory(props.docId).then((res) => {
        const { code, data, message } = res;
        if (code === 200) {
          return Promise.resolve(data);
        } else {
          return Promise.reject(new Error(message));
        }
      });
    },
    loadHistoryData(version: number) {
      docApi.getHistoryData(props.docId, version).then((res) => {
        const { code, data, message } = res;
        if (code === 200) {
          return Promise.resolve(data);
        } else {
          return Promise.reject(new Error(message));
        }
      });
    },
    triggerForceSave() {
      return docApi.forceSave(props.docId).then((res) => {
        const { data, code, message } = res;
        if (code === 200 && data) {
          return Promise.resolve(true);
        } else {
          return Promise.reject(message);
        }
      });
    },
    triggerKickout(userIds) {
      return docApi.kickout(props.docId, userIds).then((res) => {
        const { code, data, message } = res;
        if (code === 200 && data) {
          return Promise.resolve(true);
        } else {
          return Promise.reject(new Error(message));
        }
      });
    },
    triggerKickoutOthers() {
      return docApi.kickoutOthers(props.docId).then((res) => {
        const { code, data, message } = res;
        if (code === 200 && data) {
          return Promise.resolve(true);
        } else {
          return Promise.reject(new Error(message));
        }
      });
    },
    triggerKickoutAll() {
      return docApi.kickoutAll(props.docId).then((res) => {
        const { code, data, message } = res;
        if (code === 200 && data) {
          return Promise.resolve(true);
        } else {
          return Promise.reject(new Error(message));
        }
      });
    },
    triggerOnlineDocUser() {
      return docApi.getOnlineDocUser(props.docId).then((res) => {
        const { code, data, message } = res;
        if (code === 200) {
          return Promise.resolve(data);
        } else {
          return Promise.reject(new Error(message));
        }
      });
    },
    triggerRestore(version) {
      return docApi.restore(props.docId, version).then((res) => {
        const { code, message } = res;
        if (code === 200) {
          return Promise.resolve(true);
        } else {
          return Promise.reject(message);
        }
      });
    },
    triggerRename(newfilename) {
      return docApi.rename(props.docId, { newfilename }).then((res) => {
        const { code, message } = res;
        if (code === 200) {
          return Promise.resolve(true);
        } else {
          return Promise.reject(message);
        }
      });
    },
  };
});

onMounted(() => {
  editorApi.editor(props.docId).then((res) => {
    const { code, data, message } = res;
    if (code === 200) {
      configRef.value = data;
    } else {
      messageApi.error(message);
    }
  });
});

const onDocumentBeforeDestroy = () => {
  messageApi.info('onDocumentBeforeDestroy');
};

const onDocumentReady = (editor: IEditor) => {
  editorRef.value = editor;
};

const onlineDocUser = () => {
  editorRef.value?.onlineDocUser?.((user) => {
    messageApi.info(JSON.stringify(user));
  });
};
</script>
