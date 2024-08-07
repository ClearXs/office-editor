<template>
  <div class="w-[100vw] h-[100vh]">
    <n-space class="absolute">
      <n-button @click="editorRef?.triggerKickout?.(['1'])" type="primary">
        提出
      </n-button>
      <n-button @click="editorRef?.triggerKickoutAll()" type="primary">
        提出所有人
      </n-button>
      <n-button @click="editorRef?.triggerKickoutOthers()" type="primary">
        提出其他人
      </n-button>
      <n-button @click="editorRef?.triggerForceSave()" type="primary">
        强制保存
      </n-button>
      <n-button @click="onlineDocUser" type="primary"> 在线用户 </n-button>
    </n-space>
    <office-editor
      :docId="$route.params.id"
      height="100%"
      width="100%"
      :onDocumentReady="onDocumentReady"
      :onDocumentBeforeDestroy="onDocumentBeforeDestroy"
    >
    </office-editor>
  </div>
</template>

<script lang="ts" setup>
import { OfficeEditor, type IEditor } from '@office-editor/vue3';
import { useMessage } from 'naive-ui';
import { ref } from 'vue';

const message = useMessage();

const editorRef = ref<IEditor | undefined>();

const onDocumentBeforeDestroy = () => {
  message.info('onDocumentBeforeDestroy');
};

const onDocumentReady = (editor: IEditor) => {
  editorRef.value = editor;
};

const onlineDocUser = () => {
  editorRef.value?.onlineDocUser?.((user) => {
    message.info(JSON.stringify(user));
  });
};
</script>
