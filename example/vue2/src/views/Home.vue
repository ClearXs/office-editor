<template>
  <div class="p-20">
    <avue-crud
      :option="option"
      :data="data"
      :search.sync="search"
      @row-save="save"
      :upload-after="uploadAfter"
      @before-open="beforeOpen"
    >
      <template slot="menuLeft">
        <div :style="{ display: 'flex' }">
          <el-upload
            action="/api/office/v1/doc/saves"
            :limit="1"
            accept=".xls,.xlsx,.doc,.docx,.ppt,.pptx"
            :show-file-list="false"
            :on-success="uploadFinish"
            :headers="uploadHeader"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
          <el-button type="primary" size="small" @click="showTokenForm = true"
            >设置token</el-button
          >
        </div>
      </template>
      <template slot-scope="{ row }" slot="menu">
        <el-button size="small" @click="$router.push(`/editor/${row.id}`)"
          >查看</el-button
        >
        <el-button
          size="small"
          @click="
            show = true;
            docId = row.id;
          "
          >显示</el-button
        >
        <el-button size="small" @click="show = false">关闭</el-button>
        <el-button size="small" @click="download(row)">下载</el-button>
      </template>
    </avue-crud>

    <el-dialog :visible.sync="showTokenForm">
      <avue-form :option="tokenOption" @submit="setToken"></avue-form>
      <div>
        管理员:
        <p>
          eyJraWQiOiJ0dXJibyBqd3QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ0b2tlbiIsImNyZWRlbnRpYWxzTm9uRXhwaXJlZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9hbGxpby5jYyIsInVzZXJJZCI6MTE2NjAxMDcyMTM5MDAzNDk0NCwiZW5hYmxlZCI6dHJ1ZSwiYXV0aG9yaXRpZXMiOlt7InJvbGVJZCI6MTE3MjQ4NjE4NjYxNTE3NzIxNiwicm9sZUNvZGUiOiJhZG1pbmlzdHJhdG9yIiwicm9sZU5hbWUiOiLnrqHnkIblkZgifSx7InJvbGVJZCI6MTE3Nzk3MDUwMDk1ODE1ODg0OCwicm9sZUNvZGUiOiJhc2QiLCJyb2xlTmFtZSI6Indhc2FkIn0seyJyb2xlSWQiOjExNzQwNDU0NzIyODIzNzgyNDAsInJvbGVDb2RlIjoiYXNkMjEyMSIsInJvbGVOYW1lIjoiYXNkIn0seyJyb2xlSWQiOjExNzQwNDU1MDQ5NDgyNzMxNTIsInJvbGVDb2RlIjoiYXNkMjEyMSIsInJvbGVOYW1lIjoiYXNkIn0seyJyb2xlSWQiOjExNzc5NzA4ODA5OTU3ODY3NTIsInJvbGVDb2RlIjoiMjEiLCJyb2xlTmFtZSI6IjIxIn0seyJyb2xlSWQiOjExNzQwNDUzNTI3MDIzNzc5ODQsInJvbGVDb2RlIjoiYXNkMjEyMSIsInJvbGVOYW1lIjoiYXNkIn1dLCJwYXNzd29yZCI6ImZlRVNvblJjSXNuamdYYUZ4QlY0QUE9PSIsImFkbWluaXN0cmF0b3IiOnRydWUsImFjY291bnROb25FeHBpcmVkIjp0cnVlLCJleHAiOjQ4ODA1MTA2NjgsImlhdCI6MTcyNDgzNzA2OCwianRpIjoiMTFiZGNlNzBkYjcyMDAwMCIsImFjY291bnROb25Mb2NrZWQiOnRydWUsInVzZXJuYW1lIjoiYWRtaW4ifQ.m8Cmwm7zYaBXsrNXzrx2gMmbtMwcfpjloFgM5wQUWXHADOikBGuY5oLOF50pAzMd8MRZxfuPMEKdR7lmOo_xxcs_t0TSriVGmMQ0rIUCk4r6digoKpgOJLoXzMIilP3QZ3ZSZ4HAU5MYgzFk579eE1za5fqQUTiabCBCqos0lAqC7rtO8STf7jG8TFRJCooQo3ml1W-CI0DDAB3x1NGeP5SPRK-xIlOYRNeiubz886VSDU9t7AYvvqsvzuuiiRLZf4tGpCCRkPN-aphfsqBt0WcIZCdeWyAE4S_lv3PMfZcO1cxiitgVf7e34tWyXJCejDAeJtNCCdnIgT5Wint62w
        </p>
      </div>
    </el-dialog>

    <div
      v-if="show && docId !== undefined"
      :style="{ height: '100vh', width: '100vw' }"
    >
      <editor :docId="docId"></editor>
    </div>
  </div>
</template>

<script lang="ts">
import useDocApi, { Doc } from '@/api/doc';
import Editor from './Editor.vue';
import { type IEditor } from '@office-editor/vue2/src';
import Cookies from 'js-cookie';
import { PropType } from 'vue';

const docApi = useDocApi();

export default {
  components: {
    Editor,
  },
  data() {
    return {
      data: [] as Doc[],
      docEditor: Object as PropType<IEditor>,
      search: {},
      show: false,
      docId: undefined,
      showTokenForm: false,
      uploadHeader: {
        'X-AUTHENTICATION': Cookies.get('X-AUTHENTICATION'),
        'X-TENANT': '0',
      },
      option: {
        addBtn: false,
        editBtn: false,
        delBtn: false,
        searchBtnText: '查询',
        searchBtnIcon: 'el-icon-user',
        emptyBtnText: '重置',
        emptyBtnIcon: 'el-icon-close',
        menuWidth: 800,
        column: [
          {
            label: '文档名称',
            prop: 'title',
            search: false,
            display: false,
          },
          {
            label: '附件上传',
            prop: 'file',
            type: 'upload',
            limit: 1,
            accept: '.xls,.xlsx,.doc,.docx',
            action: '/api/doc/saves',
            showFileList: true,
            hide: true,
            rules: [
              {
                required: true,
              },
            ],
            propsHttp: {
              res: 'result',
              name: 'fileName',
              url: 'filePath',
            },
          },
          {
            label: '创建时间',
            prop: 'createTime',
            search: false,
            display: false,
          },
        ],
      },
      tokenOption: {
        column: [
          {
            label: 'token',
            prop: 'token',
            type: 'textarea',
            span: 24,
            rules: [
              {
                required: true,
              },
            ],
          },
        ],
      },
      file: undefined,
    };
  },

  mounted() {
    this.load();
  },

  methods: {
    load() {
      this.loadDocList();
    },
    loadDocList() {
      docApi.list({}).then((res) => {
        const { code, data, message } = res;
        if (code === 200) {
          this.data = data;
        } else {
          this.$message.error({ message: message });
        }
      });
    },
    save(row, done, loading) {
      docApi
        .saveOrUpdate({ ...row, file: JSON.stringify([this.file]) })
        .then((res) => {
          const { code, message } = res;
          if (code === 200) {
            this.$message({ type: 'success', message });
            done();
            this.load();
          } else {
            this.$message({ type: 'error', message });
          }
        })
        .finally(() => {
          loading(false);
        });
    },
    uploadAfter(res, done, loading, column) {
      this.file = res;
      done();
    },
    beforeOpen() {
      this.file = undefined;
    },
    setToken({ token }, done) {
      Cookies.set('X-AUTHENTICATION', token);
      this.$message.success('修改成功');
      done();
      document.location.reload();
    },
    download(row: Doc) {
      window.open(
        `/api/office/v1/doc/download/${row.id}?X-AUTHENTICATION=${Cookies.get(
          'X-AUTHENTICATION'
        )}&X-TENANT=0`
      );
    },
    uploadFinish() {
      this.loadDocList();
    },
    onDocumentReady(docEditor: IEditor) {
      this.$message('onDocumentReady');
      this.docEditor = docEditor;
    },
    onDocumentBeforeDestroy() {
      this.$message('onDocumentBeforeDestroy');
      this.docEditor = undefined;
    },
    onlineDocUser() {
      this.docEditor?.onlineDocUser((user) => {
        this.$message(JSON.stringify(user));
      });
    },
  },
};
</script>
