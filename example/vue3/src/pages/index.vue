<template>
  <div class="p-10">
    <n-space vertical :size="12">
      <n-space>
        <n-upload
          action="/api/office/v1/doc/saves"
          :headers="{
            'X-AUTHENTICATION': Cookies.get('X-AUTHENTICATION'),
          }"
          accept=".doc,.docx,.ppt,.pptx,.xls,.xlsx"
        >
          <n-button>上传文件</n-button>
        </n-upload>
        <n-button @click="showTokenForm = true">设置token</n-button>
      </n-space>
      <n-data-table
        :loading="loading"
        :columns="columns"
        :data="docList"
        :pagination="pagination"
      />
    </n-space>
    <n-modal v-model:show="showTokenForm">
      <n-card
        class="w-[600px]"
        title="设置token"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-form
          ref="formTokenRef"
          :model="formTokenValue"
          :rules="formTokenRules"
        >
          <n-form-item label="token" path="token">
            <n-input
              v-model:value="formTokenValue.token"
              placeholder=""
              type="textarea"
            />
          </n-form-item>
          <n-form-item>
            <n-space>
              <n-button @click="setToken" type="primary"> 确定 </n-button>
              <n-button @click="showTokenForm = false"> 取消 </n-button>
            </n-space>
          </n-form-item>

          <n-space>
            <div>
              管理员:
              <p>
                eyJraWQiOiJ0dXJibyBqd3QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ0b2tlbiIsImNyZWRlbnRpYWxzTm9uRXhwaXJlZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9hbGxpby5jYyIsImF2YXRhciI6Imh0dHA6Ly8xMjcuMC4wLjE6ODYwMC9zeXMvYXR0YWNobWVudC9kb3dubG9hZC8xMTM1NDMxODlfcDBfbWFzdGVyMTIwMC5qcGciLCJ1c2VySWQiOjExNjYwMTA3MjEzOTAwMzQ5NDQsImVuYWJsZWQiOnRydWUsImF1dGhvcml0aWVzIjpbeyJyb2xlSWQiOjExNzQwNDU0NzIyODIzNzgyNDAsInJvbGVDb2RlIjoiYXNkMjEyMSIsInJvbGVOYW1lIjoiYXNkIn0seyJyb2xlSWQiOjExNzc5NzA4ODA5OTU3ODY3NTIsInJvbGVDb2RlIjoiMjEiLCJyb2xlTmFtZSI6IjIxIn0seyJyb2xlSWQiOjExNzc5NzA1MDA5NTgxNTg4NDgsInJvbGVDb2RlIjoiYXNkIiwicm9sZU5hbWUiOiJ3YXNhZCJ9LHsicm9sZUlkIjoxMTc0MDQ1MzUyNzAyMzc3OTg0LCJyb2xlQ29kZSI6ImFzZDIxMjEiLCJyb2xlTmFtZSI6ImFzZCJ9LHsicm9sZUlkIjoxMTcyNDg2MTg2NjE1MTc3MjE2LCJyb2xlQ29kZSI6IjMyIiwicm9sZU5hbWUiOiLnrqHnkIblkZgifSx7InJvbGVJZCI6MTE3NDA0NTUwNDk0ODI3MzE1Miwicm9sZUNvZGUiOiJhc2QyMTIxIiwicm9sZU5hbWUiOiJhc2QifV0sInBhc3N3b3JkIjoiZmVFU29uUmNJc25qZ1hhRnhCVjRBQT09IiwicGhvbmUiOiIxMjMxMTMxMyIsIm5pY2tuYW1lIjoiampqampqamoiLCJ0ZW5hbnRJZCI6MCwiYWNjb3VudE5vbkV4cGlyZWQiOnRydWUsImV4cCI6MTcyMzEwMzAzNCwiaWF0IjoxNzIzMDE2NjM0LCJqdGkiOiIxMWEyYWUwOTA4M2EwMDAwIiwiZW1haWwiOiJqaWFuZ3cxMDI3QGdtYWlsLmNvbSIsImFjY291bnROb25Mb2NrZWQiOnRydWUsInVzZXJuYW1lIjoiYWRtaW4ifQ.tNWTZDVAxDDXLgVWd2RtnlCX2MSabTpsiZWGypdoaMiVzW2d1de2iA76HEvJAtT8mrTI2elHb8yKm6fQtb0CKgGODQeNiBR7vDJ4fygfaub4nn2xEcyGKV2B3vitDHaFixw9pNTHI1Am98vfdA2IfM63h79KmLj_h6rwCO6xy6xS3LgLoPdeJ44qYVgZPbunVCU575B-d8G7RxtCEZqwUmlVGtXXUwmLHRF2dEsOcyWnUHx32v5carUm5Qp-w8ObTuPrAZjBGFTFSfmQYPG5DiQssVPxiM1CRA5vWs-O7I2YbvLeG8e7jFIYZEqPC2Ho_4P3lREX8IXSZfluUfmRNg
              </p>
            </div>
          </n-space>
        </n-form>
      </n-card>
    </n-modal>

    <div class="w-[100vw] h-[100vh]">
      <office-editor
        v-if="show"
        :docId="selectDoc?.id"
        :onDocumentReady="onDocumentReady"
      >
      </office-editor>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useDocApi, { type Doc } from '@/api/doc';
import { type IEditor, OfficeEditor } from '@office-editor/vue3';
import Cookies from 'js-cookie';
import {
  type PaginationProps,
  type DataTableColumns,
  NButton,
  NSpace,
  useMessage,
  type FormInst,
  useDialog,
  type FormRules,
  type UploadFileInfo,
} from 'naive-ui';
import { h, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const dialogApi = useDialog();

const loading = ref<Boolean>(false);
const formLoading = ref<Boolean>(false);

const docApi = useDocApi();
const messageApi = useMessage();
const docList = ref<Doc[]>([]);
const show = ref<Boolean>(false);
const selectDoc = ref<Doc>();
const docFile = ref<Object>();

const showForm = ref<Boolean>(false);
const formRef = ref<FormInst | undefined>();
const formValues = ref<{ title: string | undefined; file: any | undefined }>({
  title: undefined,
  file: undefined,
});
const formRules = ref<FormRules>({
  title: { required: true },
  file: {
    required: true,
    validator: (rule, value) => {
      return docFile.value !== undefined;
    },
  },
});

// token form
const showTokenForm = ref<Boolean>(false);
const formTokenRef = ref<FormInst | undefined>();
const formTokenValue = ref<{ token: string }>({ token: undefined });
const formTokenRules = ref({ token: { required: true } });

const router = useRouter();

const docEditor = ref<IEditor | undefined>();

const columns = ref<DataTableColumns<Doc>>([
  {
    title: '文档名称',
    key: 'title',
  },
  {
    title: '创建时间',
    key: 'createTime',
  },
  {
    key: 'actions',
    width: '800',
    render(rowData, rowIndex) {
      return h(NSpace, {}, [
        h(
          NButton,
          {
            dashed: true,
            onClick(e) {
              router.push(`/editor/${rowData.id}`);
            },
          },
          { default: '查看' }
        ),
        h(
          NButton,
          {
            type: 'error',
            dashed: true,
            onClick(e) {
              const deleteDialog = dialogApi.warning({
                title: '删除',
                content: `是否确定删除${rowData.title}的数据`,
                positiveText: '确定',
                negativeText: '取消',
                onPositiveClick: () => {
                  deleteDialog.loading = true;
                  docApi
                    .deleteBatchIds(rowData.id)
                    .then((res) => {
                      const { code, message } = res;
                      if (code === 200) {
                        messageApi.success(message);
                        deleteDialog.destroy();
                      } else {
                        messageApi.error(message);
                      }
                    })
                    .finally(() => {
                      deleteDialog.loading = false;
                    });
                },
              });
            },
          },
          { default: '删除' }
        ),
        h(
          NButton,
          {
            dashed: true,
            type: 'primary',
            onClick(e) {
              selectDoc.value = rowData;
              show.value = true;
            },
          },
          { default: '显示' }
        ),
        h(
          NButton,
          {
            dashed: true,
            type: 'tertiary',
            onClick(e) {
              selectDoc.value = undefined;
              show.value = false;
            },
          },
          { default: '关闭' }
        ),
        h(
          NButton,
          {
            dashed: true,
            type: 'warning',
            onClick(e) {
              docEditor.value?.triggerKickout(['1']);
            },
          },
          { default: '踢出' }
        ),
        h(
          NButton,
          {
            dashed: true,
            type: 'warning',
            onClick(e) {
              docEditor.value?.triggerKickoutAll();
            },
          },
          { default: '踢出所有人' }
        ),
        h(
          NButton,
          {
            dashed: true,
            type: 'warning',
            onClick(e) {
              docEditor.value?.triggerKickoutOthers();
            },
          },
          { default: '踢出其他人' }
        ),
        h(
          NButton,
          {
            dashed: true,
            type: 'primary',
            onClick(e) {
              docEditor.value?.triggerForceSave();
            },
          },
          { default: '强制保存' }
        ),
        h(
          NButton,
          {
            dashed: true,
            type: 'tertiary',
            onClick(e) {
              docEditor.value?.onlineDocUser((users) => {
                messageApi.info(JSON.stringify(users));
              });
            },
          },
          { default: '在线用户' }
        ),
      ]);
    },
  },
]);

const pagination = ref<PaginationProps>({
  page: 1,
  pageSize: 5,
});

const save = () => {
  formRef.value?.validate((errors) => {
    if (errors === undefined) {
      formLoading.value = true;
      docApi
        .saveOrUpdate({
          title: formValues.value.title,
          file: JSON.stringify([docFile]),
        })
        .then((res) => {
          const { code, message } = res;
          if (code === 200) {
            messageApi.success(message);
          } else {
            messageApi.error(message);
          }
        })
        .finally(() => {
          formLoading.value = false;
        });
    }
  });
};

const uploadFinish = (file: UploadFileInfo) => {
  docFile.value = file;
};

const uploadRemove = () => {
  docFile.value = undefined;
};

const uploadChange = () => {
  console.log(this);
};

const setToken = () => {
  formTokenRef.value?.validate((errors) => {
    if (errors === undefined) {
      const { token } = formTokenValue.value;
      Cookies.set('X-AUTHENTICATION', token);
      messageApi.success('修改成功');
      document.location.reload();
    }
  });
};

const onDocumentReady = (editor: IEditor) => {
  docEditor.value = editor;
};

onMounted(() => {
  loading.value = true;
  docApi
    .page({
      current: pagination.value.page,
      size: pagination.value.pageSize,
    })
    .then((res) => {
      const { code, data, message } = res;
      if (code === 200) {
        docList.value = data.records;
        pagination.value.itemCount = data.total;
      } else {
        messageApi.error(message);
      }
    })
    .finally(() => {
      loading.value = false;
    });
});
</script>
