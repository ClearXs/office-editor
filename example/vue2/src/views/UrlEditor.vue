<template>
  <div class="w-[100vw] h-[100vh]">
    <div class="flex gap-2 absolute">
      <el-button size="small" @click="editor?.triggerKickout?.(['1'])"
        >踢出</el-button
      >
      <el-button size="small" @click="editor?.triggerKickoutAll?.()"
        >踢出所有人</el-button
      >
      <el-button size="small" @click="editor?.triggerKickoutOthers?.()"
        >踢出其他人</el-button
      >
      <el-button size="small" @click="editor?.triggerForceSave?.()"
        >强制保存</el-button
      >
      <el-button size="small" @click="onlineDocUser">在线用户</el-button>
    </div>
    <doc-editor
      :id="$route.params.id"
      docUrl="/office-api"
      :user="user"
      cipher="allio"
      width="100%"
      heigh="100%"
      printLog
      :onDocumentReady="onDocumentReady"
      :onDocumentBeforeDestroy="onDocumentBeforeDestroy"
    ></doc-editor>
  </div>
</template>

<script lang="ts">
import { type IEditor, DocEditor } from '@clearx/office-editor-vue2';

export default {
  name: 'url-editor',
  components: { DocEditor },
  data() {
    return {
      editor: {},
      user: {
        userId: '1',
        username: 'zhangsan',
      },
    };
  },
  methods: {
    onDocumentReady(editor: IEditor) {
      this.$message('onDocumentReady');
      this.editor = editor;
    },
    onDocumentBeforeDestroy() {
      this.$message('onDocumentBeforeDestroy');
      this.editor = undefined;
    },
    onlineDocUser() {
      this.editor?.onlineDocUser?.((user) => {
        this.$message(JSON.stringify(user));
      });
    },
  },
};
</script>
