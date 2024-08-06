<template>
  <div class="p-10">
    <n-space vertical :size="12">
      <n-space>
        <n-button type="primary" @click="showForm = true">新建</n-button>
        <n-button @click="showTokenForm = true">设置token</n-button>
      </n-space>
      <n-data-table
        :loading="loading"
        :columns="columns"
        :data="data"
        :pagination="pagination"
      />
    </n-space>
    <n-modal v-model:show="showForm">
      <n-card
        style="width: 600px"
        title="新建"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <n-form ref="formRef" :model="formValues" :rules="formRules">
          <n-form-item label="文档名称" path="title">
            <n-input v-model:value="formValues.title" placeholder="" />
          </n-form-item>
          <n-form-item label="文件" path="file">
            <n-upload
              v-model:value="formValues.file"
              accept=".xls,.xlsx,.doc,.docx"
              action="/api/sys/attachment/upload"
              :max="1"
              :show-file-list="true"
              :on-finish="uploadFinish"
              :on-remove="uploadRemove"
              :on-change="uploadChange"
            >
              <n-button>上传文件</n-button>
            </n-upload>
          </n-form-item>
          <n-form-item>
            <n-space>
              <n-button @click="save" type="primary" :loading="formLoading">
                确定
              </n-button>
              <n-button @click="showForm = false" :loading="formLoading">
                取消
              </n-button>
            </n-space>
          </n-form-item>
        </n-form>
      </n-card>
    </n-modal>
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
                eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjdXJyZW50VGltZU1pbGxpcyI6IjE3MjE4OTA0NTczNzUiLCJleHAiOjM3NzIxODkyMjU3LCJhY2NvdW50IjoiYWRtaW4ifQ.DTeX1eTAdZF8jjdZIi5j-w4T3RxV4fHhXf1fw7EELXM
              </p>
            </div>
            <div>
              cy66:
              <p>
                eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjdXJyZW50VGltZU1pbGxpcyI6IjE3MTU3ODU3MzM0MjQiLCJleHAiOjM3NzE1Nzg3NTMzLCJhY2NvdW50IjoiY3MzeSJ9.Rliuez4zKrRb3eRAZl69KihphlvL0KoOYoppQxXNIcM
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
const data = ref<Doc[]>([]);
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
                    .deleteById(rowData.id)
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
        .save({
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
      Cookies.set('Access-Token', token);
      Cookies.set('accessToken', token);
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
    .selectPage({
      current: pagination.value.page,
      size: pagination.value.pageSize,
    })
    .then((res) => {
      const { code, result, message } = res;
      if (code === 200) {
        const docList = result.records;
        data.value = docList!;
        pagination.value.itemCount = result.total;
      } else {
        messageApi.error(message);
      }
    })
    .finally(() => {
      loading.value = false;
    });
});
</script>
