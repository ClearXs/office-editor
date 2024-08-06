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
    <office-editor
      :docId="$route.params.id"
      printLog
      :onDocumentReady="onDocumentReady"
      :onDocumentBeforeDestroy="onDocumentBeforeDestroy"
    ></office-editor>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { type IEditor, OfficeEditor } from '@office-editor/vue2';

export default defineComponent({
  components: { OfficeEditor },
  data() {
    return {
      editor: Object as PropType<IEditor>,
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
});
</script>
