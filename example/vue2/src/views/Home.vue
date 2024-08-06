<template>
  <div class="p-20">
    <avue-crud
      :option="option"
      :data="data"
      :search.sync="search"
      @row-save="save"
      :upload-after="uploadAfter"
      @before-open="beforeOpen"
      @row-del="rowDel"
    >
      <template slot="menuLeft">
        <el-button type="primary" size="small" @click="showTokenForm = true"
          >设置token</el-button
        >
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
        <el-button size="small" @click="docEditor?.triggerKickout(['1'])"
          >踢出</el-button
        >
        <el-button size="small" @click="docEditor?.triggerKickoutAll()"
          >踢出所有人</el-button
        >
        <el-button size="small" @click="docEditor?.triggerKickoutOthers()"
          >踢出其他人</el-button
        >
        <el-button size="small" @click="docEditor?.triggerForceSave()"
          >强制保存</el-button
        >
        <el-button size="small" @click="onlineDocUser">在线用户</el-button>
      </template>
    </avue-crud>

    <el-dialog :visible.sync="showTokenForm">
      <avue-form :option="tokenOption" @submit="setToken"></avue-form>
      <div>
        管理员:
        <p>
          eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjdXJyZW50VGltZU1pbGxpcyI6IjE3MjE4OTA0NTczNzUiLCJleHAiOjM3NzIxODkyMjU3LCJhY2NvdW50IjoiYWRtaW4ifQ.DTeX1eTAdZF8jjdZIi5j-w4T3RxV4fHhXf1fw7EELXM
        </p>
        cy66:
        <p>
          eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjdXJyZW50VGltZU1pbGxpcyI6IjE3MTU3ODU3MzM0MjQiLCJleHAiOjM3NzE1Nzg3NTMzLCJhY2NvdW50IjoiY3MzeSJ9.Rliuez4zKrRb3eRAZl69KihphlvL0KoOYoppQxXNIcM
        </p>
      </div>
    </el-dialog>

    <div
      v-if="show && docId !== undefined"
      :style="{ height: '100vh', width: '100vw' }"
    >
      <office-editor
        :docId="docId"
        printLog
        :onDocumentReady="onDocumentReady"
        :onDocumentBeforeDestroy="onDocumentBeforeDestroy"
      ></office-editor>
    </div>
  </div>
</template>

<script lang="ts">
import useDocApi, { Doc } from '@/api/doc';
import { type IEditor, OfficeEditor } from '@office-editor/vue2';
import Cookies from 'js-cookie';
import { PropType } from 'vue';

const docApi = useDocApi();

export default {
  components: {
    OfficeEditor,
  },
  data() {
    return {
      data: [] as Doc[],
      docEditor: Object as PropType<IEditor>,
      search: {},
      show: false,
      docId: undefined,
      showTokenForm: false,
      option: {
        editBtn: false,
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
      docApi.selectList({}).then((res) => {
        const { code, result, message } = res;
        if (code === 200) {
          this.data = result;
        } else {
          this.$message.error({ message: message });
        }
      });
    },
    save(row, done, loading) {
      docApi
        .save({ ...row, file: JSON.stringify([this.file]) })
        .then((res) => {
          const { success, message } = res;
          if (success) {
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
    rowDel(row: Doc) {
      docApi.deleteById(row.id).then((res) => {
        const { code, message } = res;
        if (code === 200) {
          this.$message({ type: 'success', message });
        } else {
          this.$message({ type: 'error', message });
        }
        this.load();
      });
    },
    setToken({ token }, done) {
      Cookies.set('Access-Token', token);
      Cookies.set('accessToken', token);
      this.$message.success('修改成功');
      done();
      document.location.reload();
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
