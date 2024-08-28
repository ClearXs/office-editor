<template>
  <div
    class="w-[100vw] h-[100vh]"
    v-if="docId !== undefined && config !== undefined"
  >
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
      :id="docId"
      :config="config"
      :api="internalApi"
      printLog
      :onDocumentReady="onDocumentReady"
      :onDocumentBeforeDestroy="onDocumentBeforeDestroy"
    ></office-editor>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { type IEditor, OfficeEditor } from '@office-editor/vue2';
import useDocApi from '@/api/doc';
import { useEditorApi } from '@/api/editor';

const docApi = useDocApi();
const editorApi = useEditorApi();

export default defineComponent({
  name: 'Editor',
  components: { OfficeEditor },
  props: {
    docId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      config: undefined,
      editor: {},
      internalApi: undefined,
    };
  },
  beforeMount() {
    this.internalApi = {
      loadHistoryList: () => {
        return docApi.getHistory(this.docId).then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            return Promise.resolve(data);
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      loadHistoryData: (version: number) => {
        docApi.getHistoryData(this.docId, version).then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            return Promise.resolve(data);
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      triggerForceSave: () => {
        return docApi.forceSave(this.docId).then((res) => {
          const { data, code, message } = res;
          if (code === 200 && data) {
            return Promise.resolve(true);
          } else {
            return Promise.reject(message);
          }
        });
      },
      triggerKickout: (userIds: string[]) => {
        return docApi.kickout(this.docId, userIds).then((res) => {
          const { code, data, message } = res;
          if (code === 200 && data) {
            return Promise.resolve(true);
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      triggerKickoutOthers: () => {
        return docApi.kickoutOthers(this.docId).then((res) => {
          const { code, data, message } = res;
          if (code === 200 && data) {
            return Promise.resolve(true);
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      triggerKickoutAll: () => {
        return docApi.kickoutAll(this.docId).then((res) => {
          const { code, data, message } = res;
          if (code === 200 && data) {
            return Promise.resolve(true);
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      triggerOnlineDocUser: () => {
        return docApi.getOnlineDocUser(this.docId).then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            return Promise.resolve(data);
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      triggerRestore: (version: number) => {
        return docApi.restore(this.docId, version).then((res) => {
          const { code, message } = res;
          if (code === 200) {
            return Promise.resolve(true);
          } else {
            return Promise.reject(message);
          }
        });
      },
      triggerRename: (newfilename: string) => {
        return docApi.rename(this.docId, { newfilename }).then((res) => {
          const { code, message } = res;
          if (code === 200) {
            return Promise.resolve(true);
          } else {
            return Promise.reject(message);
          }
        });
      },
    };
  },
  mounted() {
    editorApi.editor(this.docId).then((res) => {
      const { code, data, message } = res;
      if (code === 200) {
        this.config = data;
      } else {
        this.$message.error(message);
      }
    });
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
