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
          eyJraWQiOiJ0dXJibyBqd3QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ0b2tlbiIsImNyZWRlbnRpYWxzTm9uRXhwaXJlZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9hbGxpby5jYyIsImF2YXRhciI6Imh0dHA6Ly8xMjcuMC4wLjE6ODYwMC9zeXMvYXR0YWNobWVudC9kb3dubG9hZC8xMTM1NDMxODlfcDBfbWFzdGVyMTIwMC5qcGciLCJ1c2VySWQiOjExNjYwMTA3MjEzOTAwMzQ5NDQsImVuYWJsZWQiOnRydWUsImF1dGhvcml0aWVzIjpbeyJyb2xlSWQiOjExNzc5NzA1MDA5NTgxNTg4NDgsInJvbGVDb2RlIjoiYXNkIiwicm9sZU5hbWUiOiJ3YXNhZCJ9LHsicm9sZUlkIjoxMTcyNDg2MTg2NjE1MTc3MjE2LCJyb2xlQ29kZSI6IjMyIiwicm9sZU5hbWUiOiLnrqHnkIblkZgifSx7InJvbGVJZCI6MTE3Nzk3MDg4MDk5NTc4Njc1Miwicm9sZUNvZGUiOiIyMSIsInJvbGVOYW1lIjoiMjEifSx7InJvbGVJZCI6MTE3NDA0NTM1MjcwMjM3Nzk4NCwicm9sZUNvZGUiOiJhc2QyMTIxIiwicm9sZU5hbWUiOiJhc2QifSx7InJvbGVJZCI6MTE3NDA0NTQ3MjI4MjM3ODI0MCwicm9sZUNvZGUiOiJhc2QyMTIxIiwicm9sZU5hbWUiOiJhc2QifSx7InJvbGVJZCI6MTE3NDA0NTUwNDk0ODI3MzE1Miwicm9sZUNvZGUiOiJhc2QyMTIxIiwicm9sZU5hbWUiOiJhc2QifV0sInBhc3N3b3JkIjoiZmVFU29uUmNJc25qZ1hhRnhCVjRBQT09IiwicGhvbmUiOiIxMjMxMTMxMyIsIm5pY2tuYW1lIjoiampqampqamoiLCJ0ZW5hbnRJZCI6MCwiYWNjb3VudE5vbkV4cGlyZWQiOnRydWUsImV4cCI6MTcyMzEwMjcyOCwiaWF0IjoxNzIzMDE2MzI4LCJqdGkiOiIxMWEyYWNkZTBhMTAwMDAwIiwiZW1haWwiOiJqaWFuZ3cxMDI3QGdtYWlsLmNvbSIsImFjY291bnROb25Mb2NrZWQiOnRydWUsInVzZXJuYW1lIjoiYWRtaW4ifQ.Cb85ax0u_ralrAITEhs6pJLQWTbUfvG_G0Kkh139-K7vIS4Nz2gMqKEnJv5Gtn4d_FXNyAb8-F4ZDDQasARbB5j0iviHTbaPBz_d5RISeGpULttjO1rIylnES8REenUGV0B3a7FjTJjz7vYbiT9urZ8pToyzndEc508XVOm5SPYc2WcsxQCAF5yb1VBlnbMA4o6yD2pbxCsdBBWHKLm4p1kBSaL80Hu5ZZkPPiuP0GRbuyUCsvFLTOVQso6E5jSDeXrp6S5OOKgsm6QelkMYxWzLBIEQyQ_GqkGlbrvBefVcXteZyTlshKIEe5ytgRumhsrFXrzZJL5equWsTa7qsA
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
import { type IEditor, OfficeEditor } from '@office-editor/vue2/src';
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
    rowDel(row: Doc) {
      docApi.deleteBatchIds(row.id).then((res) => {
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
      Cookies.set('X-AUTHENTICATION', token);
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
