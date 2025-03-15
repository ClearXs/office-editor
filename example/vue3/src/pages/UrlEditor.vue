<template>
  <div class="w-[100vw] h-[100vh]">
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
    <doc-editor
      :id="$route.params.id"
      docUrl="/office-api"
      :user="user"
      cipher="allio"
      :onDocumentReady="onDocumentReady"
      :onDocumentBeforeDestroy="onDocumentBeforeDestroy"
    ></doc-editor>
  </div>
</template>

<script lang="ts" setup>
import {
  DocEditor,
  type DocUser,
  type IEditor,
} from '@clearx/office-editor-vue3';
import { useMessage } from 'naive-ui';
import { ref } from 'vue';

const user = ref<DocUser>({ userId: '1', username: 'zhangsan' });
const editorRef = ref<IEditor | undefined>();
const messageApi = useMessage();

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
