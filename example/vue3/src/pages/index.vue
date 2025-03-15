<template>
  <div class="p-10">
    <n-space vertical :size="12">
      <n-space>
        <n-upload
          action="/api/office/v1/doc/saves"
          :headers="{
            'X-AUTHENTICATION': Cookies.get('X-AUTHENTICATION'),
            'X-TENANT': '0',
          }"
          accept=".doc,.docx,.ppt,.pptx,.xls,.xlsx"
          @finish="uploadFinish"
          :show-file-list="false"
        >
          <n-button>上传文件</n-button>
        </n-upload>
        <n-button @click="showTokenForm = true">设置token</n-button>
      </n-space>
      <n-data-table :loading="loading" :columns="columns" :data="docList" />
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
                eyJraWQiOiJ0dXJibyBqd3QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ0b2tlbiIsImNyZWRlbnRpYWxzTm9uRXhwaXJlZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9hbGxpby5jYyIsInVzZXJJZCI6MTE2NjAxMDcyMTM5MDAzNDk0NCwiZW5hYmxlZCI6dHJ1ZSwiYXV0aG9yaXRpZXMiOlt7InJvbGVJZCI6MTE3MjQ4NjE4NjYxNTE3NzIxNiwicm9sZUNvZGUiOiJhZG1pbmlzdHJhdG9yIiwicm9sZU5hbWUiOiLnrqHnkIblkZgifSx7InJvbGVJZCI6MTE3Nzk3MDUwMDk1ODE1ODg0OCwicm9sZUNvZGUiOiJhc2QiLCJyb2xlTmFtZSI6Indhc2FkIn0seyJyb2xlSWQiOjExNzQwNDU0NzIyODIzNzgyNDAsInJvbGVDb2RlIjoiYXNkMjEyMSIsInJvbGVOYW1lIjoiYXNkIn0seyJyb2xlSWQiOjExNzQwNDU1MDQ5NDgyNzMxNTIsInJvbGVDb2RlIjoiYXNkMjEyMSIsInJvbGVOYW1lIjoiYXNkIn0seyJyb2xlSWQiOjExNzc5NzA4ODA5OTU3ODY3NTIsInJvbGVDb2RlIjoiMjEiLCJyb2xlTmFtZSI6IjIxIn0seyJyb2xlSWQiOjExNzQwNDUzNTI3MDIzNzc5ODQsInJvbGVDb2RlIjoiYXNkMjEyMSIsInJvbGVOYW1lIjoiYXNkIn1dLCJwYXNzd29yZCI6ImZlRVNvblJjSXNuamdYYUZ4QlY0QUE9PSIsImFkbWluaXN0cmF0b3IiOnRydWUsImFjY291bnROb25FeHBpcmVkIjp0cnVlLCJleHAiOjQ4ODA1MTA2NjgsImlhdCI6MTcyNDgzNzA2OCwianRpIjoiMTFiZGNlNzBkYjcyMDAwMCIsImFjY291bnROb25Mb2NrZWQiOnRydWUsInVzZXJuYW1lIjoiYWRtaW4ifQ.m8Cmwm7zYaBXsrNXzrx2gMmbtMwcfpjloFgM5wQUWXHADOikBGuY5oLOF50pAzMd8MRZxfuPMEKdR7lmOo_xxcs_t0TSriVGmMQ0rIUCk4r6digoKpgOJLoXzMIilP3QZ3ZSZ4HAU5MYgzFk579eE1za5fqQUTiabCBCqos0lAqC7rtO8STf7jG8TFRJCooQo3ml1W-CI0DDAB3x1NGeP5SPRK-xIlOYRNeiubz886VSDU9t7AYvvqsvzuuiiRLZf4tGpCCRkPN-aphfsqBt0WcIZCdeWyAE4S_lv3PMfZcO1cxiitgVf7e34tWyXJCejDAeJtNCCdnIgT5Wint62w
              </p>
            </div>
          </n-space>
        </n-form>
      </n-card>
    </n-modal>

    <div class="w-[100vw] h-[100vh]">
      <editor
        v-if="show"
        :docId="selectDoc?.id"
        :onDocumentReady="onDocumentReady"
      >
      </editor>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useDocApi, { type Doc } from '@/api/doc';
import Editor from './Editor.vue';
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
    width: '400',
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
            dashed: true,
            onClick(e) {
              router.push(`/urleditor/${rowData.id}`);
            },
          },
          { default: '查看url' }
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
            type: 'tertiary',
            onClick(e) {
              window.open(
                `/api/office/v1/doc/download/${rowData.id}?X-AUTHENTICATION=${Cookies.get('X-AUTHENTICATION')}&X-TENANT=0`
              );
              selectDoc.value = undefined;
              show.value = false;
            },
          },
          { default: '下载' }
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
  loadList();
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
  loadList();
});

const loadList = () => {
  loading.value = true;
  docApi
    .list({})
    .then((res) => {
      const { code, data, message } = res;
      if (code === 200) {
        docList.value = data;
      } else {
        messageApi.error(message);
      }
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>
