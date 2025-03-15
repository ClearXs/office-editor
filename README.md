<p  align="center">
<img src="./docs/logo.png" height="100" align="center">
</p>

<h2 align="center">简约 · 实用 · 前沿 · 创新</h2>

# 编辑器

# 指南

该篇文档用于描述在线文档协作编辑器的使用，目前编辑器支持一下三个主流的版本：

- vue2
- vue3
- react

编辑器的目标主要是封装[onlyoffice](https://www.onlyoffice.com/)。提供更多可选性的属性

该编辑器内部提供两种组件用来提供**在线文档**的数据来源，即需要实现[IEditorApi](#IEditorApi)

- [DocEditor](#IDocEditorProps) 内置了与后端交互的 API 使用的接口是 [office-service](https://github.com/ClearXs/office-service) 提供。 如果存在跨域的话需要配置 nginx

```nginx configuration
'/api': {
    target: 'http://localhost',
    changeOrigin: true
}
```

- [OfficeEditor](#IOfficeEditorProps) 则需要用户提供相关的 API 接口来使用

# vue2

## 快速开始

安装

```bash
npm install @clearx/office-editor-vue2@latest
```

更详细的示例可以从 https://github.com/ClearXs/office-editor/tree/master/example/vue2 查看

### OfficeEditor

其中`OfficeEditor` 为模块包导出的组件，安需要引入自项目中，值得注意的是他在浏览器下的大小是默认的，需要在外层添加来控制他的大小

```vue
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
import { type IEditor, OfficeEditor } from '@clearx/office-editor-vue2';
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
```

### DocEditor

```vue
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
```

# vue3

## 快速开始

```bash
npm install @clearx/office-editor-vue3@latest
```

更详细的示例可以从 https://github.com/ClearXs/office-editor/tree/master/example/vue3 查看

### OfficeEditor

```vue
<template>
  <div
    class="w-[100vw] h-[100vh]"
    v-if="docId !== undefined && configRef !== undefined"
  >
    <n-space class="absolute">
      <n-button @click="editorRef?.triggerKickout?.(['1'])" type="primary">
        踢出
      </n-button>
      <n-button @click="editorRef?.triggerKickoutAll()" type="primary">
        踢出所有人
      </n-button>
      <n-button @click="editorRef?.triggerKickoutOthers()" type="primary">
        踢出其他人
      </n-button>
      <n-button @click="editorRef?.triggerForceSave()" type="primary">
        强制保存
      </n-button>
      <n-button @click="onlineDocUser" type="primary"> 在线用户 </n-button>
    </n-space>
    <office-editor
      :id="docId"
      :api="internalApiRef"
      :config="configRef"
      :onDocumentReady="onDocumentReady"
      :onDocumentBeforeDestroy="onDocumentBeforeDestroy"
    >
    </office-editor>
  </div>
</template>

<script lang="ts" setup>
import useDocApi from '@/api/doc';
import { useEditorApi } from '@/api/editor';
import {
  OfficeEditor,
  type DocumentEditorConfig,
  type IEditor,
  type IEditorApi,
} from '@clearx/office-editor-vue3';
import { useMessage } from 'naive-ui';
import { onBeforeMount, onMounted, ref } from 'vue';

const props = withDefaults(defineProps<{ docId: string }>(), {
  docId: undefined,
});

const docApi = useDocApi();
const editorApi = useEditorApi();

const messageApi = useMessage();
const editorRef = ref<IEditor | undefined>();
const configRef = ref<DocumentEditorConfig>();
const internalApiRef = ref<IEditorApi>();

onBeforeMount(() => {
  internalApiRef.value = {
    loadHistoryList() {
      return docApi.getHistory(props.docId).then((res) => {
        const { code, data, message } = res;
        if (code === 200) {
          return Promise.resolve(data);
        } else {
          return Promise.reject(new Error(message));
        }
      });
    },
    loadHistoryData(version: number) {
      docApi.getHistoryData(props.docId, version).then((res) => {
        const { code, data, message } = res;
        if (code === 200) {
          return Promise.resolve(data);
        } else {
          return Promise.reject(new Error(message));
        }
      });
    },
    triggerForceSave() {
      return docApi.forceSave(props.docId).then((res) => {
        const { data, code, message } = res;
        if (code === 200 && data) {
          return Promise.resolve(true);
        } else {
          return Promise.reject(message);
        }
      });
    },
    triggerKickout(userIds) {
      return docApi.kickout(props.docId, userIds).then((res) => {
        const { code, data, message } = res;
        if (code === 200 && data) {
          return Promise.resolve(true);
        } else {
          return Promise.reject(new Error(message));
        }
      });
    },
    triggerKickoutOthers() {
      return docApi.kickoutOthers(props.docId).then((res) => {
        const { code, data, message } = res;
        if (code === 200 && data) {
          return Promise.resolve(true);
        } else {
          return Promise.reject(new Error(message));
        }
      });
    },
    triggerKickoutAll() {
      return docApi.kickoutAll(props.docId).then((res) => {
        const { code, data, message } = res;
        if (code === 200 && data) {
          return Promise.resolve(true);
        } else {
          return Promise.reject(new Error(message));
        }
      });
    },
    triggerOnlineDocUser() {
      return docApi.getOnlineDocUser(props.docId).then((res) => {
        const { code, data, message } = res;
        if (code === 200) {
          return Promise.resolve(data);
        } else {
          return Promise.reject(new Error(message));
        }
      });
    },
    triggerRestore(version) {
      return docApi.restore(props.docId, version).then((res) => {
        const { code, message } = res;
        if (code === 200) {
          return Promise.resolve(true);
        } else {
          return Promise.reject(message);
        }
      });
    },
    triggerRename(newfilename) {
      return docApi.rename(props.docId, { newfilename }).then((res) => {
        const { code, message } = res;
        if (code === 200) {
          return Promise.resolve(true);
        } else {
          return Promise.reject(message);
        }
      });
    },
  };
});

onMounted(() => {
  editorApi.editor(props.docId).then((res) => {
    const { code, data, message } = res;
    if (code === 200) {
      configRef.value = data;
    } else {
      messageApi.error(message);
    }
  });
});

const onDocumentBeforeDestroy = () => {
  messageApi.info('onDocumentBeforeDestroy');
};

const onDocumentReady = (editor: IEditor) => {
  editorRef.value = editor;
};

const onlineDocUser = () => {
  editorRef.value?.onlineDocUser?.((user) => {
    messageApi.info(JSON.stringify(user));
  });
};
</script>
```

### DocEditor

```vue
<template>
  <div class="w-[100vw] h-[100vh]">
    <n-space class="absolute">
      <n-button @click="editorRef?.triggerKickout?.(['1'])" type="primary">
        踢出
      </n-button>
      <n-button @click="editorRef?.triggerKickoutAll()" type="primary">
        踢出所有人
      </n-button>
      <n-button @click="editorRef?.triggerKickoutOthers()" type="primary">
        踢出其他人
      </n-button>
      <n-button @click="editorRef?.triggerForceSave()" type="primary">
        强制保存
      </n-button>
      <n-button @click="onlineDocUser" type="primary"> 在线用户 </n-button>
    </n-space>
    <doc-editor
      :id="$route.params.id"
      docUrl="/office-api"
      :user="user"
      cipher="allio"
      :onDocumentReady="onDocumentReady"
      :onDocumentBeforeDestroy="onDocumentBeforeDestroy"
    ></doc-editor>
  </div>
</template>

<script lang="ts" setup>
import {
  DocEditor,
  type DocUser,
  type IEditor,
} from '@clearx/office-editor-vue3';
import { useMessage } from 'naive-ui';
import { ref } from 'vue';

const user = ref<DocUser>({ userId: '1', username: 'zhangsan' });
const editorRef = ref<IEditor | undefined>();
const messageApi = useMessage();

const onDocumentBeforeDestroy = () => {
  messageApi.info('onDocumentBeforeDestroy');
};

const onDocumentReady = (editor: IEditor) => {
  editorRef.value = editor;
};

const onlineDocUser = () => {
  editorRef.value?.onlineDocUser?.((user) => {
    messageApi.info(JSON.stringify(user));
  });
};
</script>
```

# react

## 快速开始

安装，要求 react 版本>=16

```tsx
npm install @clearx/@office-editor-react@latest
```

更详细的示例可以从 https://github.com/ClearXs/office-editor/tree/master/example/react 查看

### OfficeEditor

```tsx
import useDocApi from '@/api/doc';
import { useEditorApi } from '@/api/editor';
import {
  DocumentEditorConfig,
  IEditor,
  IEditorApi,
  OfficeEditor,
} from '@clearx/office-editor-react';
import { Button, message } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

export type IEditorProps = {
  docId: string;
};

const Editor: React.FC<IEditorProps> = ({ docId }) => {
  const [messageApi, messageContextHolder] = message.useMessage();
  const docApi = useDocApi();
  const editorApi = useEditorApi();

  const [config, setConfig] = useState<DocumentEditorConfig>();

  const editorRef = useRef<IEditor>();

  useEffect(() => {
    editorApi.editor(docId).then((res) => {
      const { code, data, message } = res;
      if (code === 200) {
        setConfig(data);
      } else {
        messageApi.error(message);
      }
    });
  }, [docId]);

  const internalApi: IEditorApi = useMemo(() => {
    return {
      loadHistoryList() {
        return docApi.getHistory(docId).then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            return Promise.resolve(data);
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      loadHistoryData(version) {
        docApi.getHistoryData(docId, version).then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            return Promise.resolve(data);
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      triggerForceSave() {
        return docApi.forceSave(docId).then((res) => {
          const { data, code, message } = res;
          if (code === 200 && data) {
            return Promise.resolve(true);
          } else {
            return Promise.reject(message);
          }
        });
      },
      triggerKickout(userIds) {
        return docApi.kickout(docId, userIds).then((res) => {
          const { code, data, message } = res;
          if (code === 200 && data) {
            return Promise.resolve(true);
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      triggerKickoutOthers() {
        return docApi.kickoutOthers(docId).then((res) => {
          const { code, data, message } = res;
          if (code === 200 && data) {
            return Promise.resolve(true);
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      triggerKickoutAll() {
        return docApi.kickoutAll(docId).then((res) => {
          const { code, data, message } = res;
          if (code === 200 && data) {
            return Promise.resolve(true);
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      triggerOnlineDocUser() {
        return docApi.getOnlineDocUser(docId).then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            return Promise.resolve(data);
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      triggerRestore(version) {
        return docApi.restore(docId, version).then((res) => {
          const { code, message } = res;
          if (code === 200) {
            return Promise.resolve(true);
          } else {
            return Promise.reject(message);
          }
        });
      },
      triggerRename(newfilename) {
        return docApi.rename(docId, { newfilename }).then((res) => {
          const { code, message } = res;
          if (code === 200) {
            return Promise.resolve(true);
          } else {
            return Promise.reject(message);
          }
        });
      },
    };
  }, [docId]);

  return (
    <>
      {messageContextHolder}
      {config && (
        <div style={{ height: '100vh', width: '100vw' }}>
          <OfficeEditor
            id={docId}
            config={config}
            api={internalApi}
            printLog={true}
            onDocumentReady={(editor) => {
              editorRef.current = editor;
            }}
            onDocumentBeforeDestroy={() => {
              console.log(this);
            }}
          />

          <div
            style={{ display: 'flex', position: 'absolute', top: 0, gap: 10 }}
          >
            <Button onClick={() => editorRef.current?.triggerKickout?.(['1'])}>
              踢出
            </Button>
            <Button onClick={() => editorRef.current?.triggerKickoutAll?.()}>
              踢出所有人
            </Button>
            <Button onClick={() => editorRef.current?.triggerKickoutOthers?.()}>
              踢出其他人
            </Button>
            <Button onClick={() => editorRef.current?.triggerForceSave?.()}>
              强制保存
            </Button>
            <Button
              onClick={() =>
                editorRef.current?.onlineDocUser?.((users) => {
                  message.info(JSON.stringify(users));
                })
              }
            >
              在线用户
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Editor;
```

### DocEditor

```tsx
import { DocEditor, IEditor } from '@clearx/office-editor-react';
import { useParams } from '@umijs/max';
import { Button, message } from 'antd';
import { useRef } from 'react';

const UrlEditor: React.FC = ({}) => {
  const params = useParams<{ docId: string }>();
  const editorRef = useRef<IEditor>();

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <DocEditor
        id={params.docId!}
        docUrl='/office-api'
        user={{ userId: '1', username: 'zhangsan' }}
        cipher='allio'
        printLog={true}
        onDocumentReady={(editor) => {
          editorRef.current = editor;
        }}
        onDocumentBeforeDestroy={() => {
          console.log(this);
        }}
      />

      <div style={{ display: 'flex', position: 'absolute', top: 0, gap: 10 }}>
        <Button onClick={() => editorRef.current?.triggerKickout?.(['1'])}>
          踢出
        </Button>
        <Button onClick={() => editorRef.current?.triggerKickoutAll?.()}>
          踢出所有人
        </Button>
        <Button onClick={() => editorRef.current?.triggerKickoutOthers?.()}>
          踢出其他人
        </Button>
        <Button onClick={() => editorRef.current?.triggerForceSave?.()}>
          强制保存
        </Button>
        <Button
          onClick={() =>
            editorRef.current?.onlineDocUser?.((users) => {
              message.info(JSON.stringify(users));
            })
          }
        >
          在线用户
        </Button>
      </div>
    </div>
  );
};

export default UrlEditor;
```

# API

vue2、vue3、react 框架属性保持一致，各个属性在各个框架作用都相同。

## `IOfficeEditorProps`

`OfficeEditor` 组件属性

| 属性                           | required | 说明                                                                                                                     | 类型                                                    | 默认值                                                                                                                   |
| ------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `docId`                        | true     | 必传，`文档唯一ID`，通过接口获取文档数据的 id 值                                                                         | string                                                  |                                                                                                                          |
| `height`                       | false    | `定义浏览器窗口中的文档高度。`                                                                                           | string                                                  | 100%                                                                                                                     |
| `width`                        | false    | `定义浏览器窗口中的文档宽度。`                                                                                           | string                                                  | 100%                                                                                                                     |
| `action`                       | false    | 编辑器操作，默认为 edit                                                                                                  | `EditorAction`                                          | edit                                                                                                                     |
| `type`                         | false    | 编辑器类型，默认为 desktop                                                                                               | `EditorType`                                            | destop                                                                                                                   |
| `printLog`                     | false    | 是否打印日志                                                                                                             | boolean                                                 | true                                                                                                                     |
| `config`                       | false    | 编辑器配置                                                                                                               | `Config`                                                | { logo: undefined, plugins: true, integrationMode: 'embed', spellcheck: true, unit: 'cm', hideNotes: false, zoom: 100, } |
| `onDocumentReady`              | false    | 将文档加载到文档编辑器时调用的函数。                                                                                     | `(editor: IEditor) => void`                             |                                                                                                                          |
| `onLoadComponentError`         | false    | 加载组件时发生错误时调用的函数。                                                                                         | `(errorCode: number, errorDescription: string) => void` |                                                                                                                          |
| `onMetaChange`                 | false    | 通过 meta 命令更改文档的元信息时调用的函数。                                                                             | `(meta: any) => void`                                   |                                                                                                                          |
| `onInfo`                       | false    | 应用程序打开文件时调用的函数。                                                                                           | `(info: any) => void`                                   |                                                                                                                          |
| `onWarning`                    | false    | info 信息调用的函数                                                                                                      | `(warning: any) => void`                                |                                                                                                                          |
| `onError`                      | false    | 发生错误或其他特定事件时调用的函数。[错误码说明](https://github.com/ONLYOFFICE/sdkjs/blob/master/common/errorCodes.js)： | `(error: any) => void`                                  |                                                                                                                          |
| `onRequestSharingSettings`     | false    | 当用户尝试通过单击 "更改访问权限" 按钮来管理文档访问权限时调用的函数。                                                   | `(settings?: any) => void`                              |                                                                                                                          |
| `onRequestRename`              | false    | 当用户尝试通过单击 "重命名..." 按钮重命名文件时调用的函数。                                                              | `(rename: any) => void`                                 |                                                                                                                          |
| `onMakeActionLink`             | false    | 当用户试图获取打开包含书签的文档的链接时调用的函数，滚动到书签位置。                                                     | `(link: any) => void`                                   |                                                                                                                          |
| `onRequestInsertImage`         | false    | 当用户尝试通过单击 "来自存储的图像" 按钮插入图像时调用的函数。                                                           | `(insertImages: any) => void`                           |                                                                                                                          |
| `onRequestMailMergeRecipients` | false    | 当用户尝试通过单击 "邮件合并" 按钮来选择收件人数据时调用的函数。                                                         | ` (mail: any) => void`                                  |                                                                                                                          |
| `onRequestCompareFile`         | false    | 当用户尝试通过单击 "存储中的文档" 按钮来选择要比较的文档时调用的函数。                                                   | `(file: any) => void`                                   |                                                                                                                          |
| `onRequestEditRights`          | false    | 当用户尝试通过单击 "编辑文档" 按钮将文档从查看模式切换到编辑模式时调用的函数。                                           | `(right: any) => void`                                  |                                                                                                                          |
| `onRequestHistory`             | false    | 当用户尝试通过单击 "版本历史记录" 按钮来显示文档版本历史记录时调用的函数。                                               | `() => void`                                            |                                                                                                                          |
| `onRequestHistoryData`         | false    | 当用户试图单击文档版本历史记录中的特定文档版本时调用的函数。                                                             | `(version: number) => void`                             |                                                                                                                          |
| `onRequestHistoryClose`        | false    | 当用户试图通过单击 "关闭历史记录" 按钮从查看文档版本历史记录返回到文档时调用的函数。                                     | `() => void`                                            |                                                                                                                          |
| `onRequestRestore`             | false    | 当用户尝试通过单击版本历史记录中的 "恢复" 按钮来恢复文件版本时调用的函数。                                               | `(history: any) => void`                                |                                                                                                                          |
| `onDocumentStateChange`        | false    | 文档状态变更时回调                                                                                                       | `(state: any) => void`                                  |                                                                                                                          |
| `onDocumentBeforeDestroy`      | false    | 当文档组件销毁前回调                                                                                                     | `() => void`                                            |                                                                                                                          |

## `EditorAction`

```tsx
type EditorAction =
  | 'edit'
  | 'review'
  | 'view'
  | 'embedded'
  | 'filter'
  | 'comment'
  | 'chat'
  | 'fillForms'
  | 'blockcontent';
```

| 值           | 说明     |
| ------------ | -------- |
| edit         | 编辑     |
| review       | 预览     |
| view         | 浏览     |
| embedded     | 嵌入     |
| filter       |          |
| chat         |          |
| fillForms    | 填充表单 |
| blockcontent |          |

## `EditorType`

```tsx
type EditorType = 'desktop' | 'mobile' | 'embedded';
```

| 值       | 说明     |
| -------- | -------- |
| destop   | 桌面端   |
| mobile   | 移动端   |
| embedded | 嵌入式端 |

## `Config`

| 属性              | required | 说明                                                                                       | 类型                     | 默认值    |
| ----------------- | -------- | ------------------------------------------------------------------------------------------ | ------------------------ | --------- |
| `logo`            | false    | logo                                                                                       | `Logo`                   | undefined |
| `plugins`         | false    | 定义插件是否将启动并可用。默认值是 true。                                                  | boolean                  | true      |
| `integrationMode` | false    | 定义将编辑器嵌入网页的模式。由于未捕获焦点，嵌入值在加载编辑器框架时会禁用滚动到编辑器框架 | string                   | embed     |
| `spellcheck`      | false    | 定义加载编辑器时是否自动打开或关闭拼写检查器。默认为 true                                  | boolean                  | false     |
| `unit`            | false    | 定义标尺和对话框中使用的测量单位。\ncm: centimeters\npt: points\ninch: inches 默认取 cm    | `'cm' \| 'pt' \| 'inch'` | `cm`      |
| `hideNotes`       | false    | 定义在首次加载时是否显示或隐藏注释面板.默认值为 false。此参数仅适用于演示文稿编辑器。      | boolean                  | false     |
| `zoom`            | false    | 定义以百分比为单位的文档显示缩放值,默认值为 100                                            | number                   | 100       |

## `Logo`

| 属性            | required | 说明               | 类型   | 默认值 |
| --------------- | -------- | ------------------ | ------ | ------ |
| `image`         | false    | logo 图片地址      | string |        |
| `imageDark`     | false    | 深色主题图片地址   | string |        |
| `imageEmbedded` | false    | 嵌入式的图片地址   | string |        |
| `url`           | false    | 点击图片跳转的地址 | string |        |

## `IEditor`

`IEditor` 类型的对象可以通过 `IOfficeEditorProps` 参数中 `onDocumentReady?: (editor: IEditor) => void` 的回调获取。

| 属性                   | 说明                                                                   | 类型                                                                                   |
| ---------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `createConnector`      | 创建连接器以与外部的文本文档、电子表格、演示文稿和可填写表单进行交互。 | `Function`                                                                             |
| `refreshHistory`       | 刷新历史数据                                                           | `Function`                                                                             |
| `setHistoryData`       | 设置历史数据                                                           | `Function`                                                                             |
| `requestClose`         | 请求关闭编辑器。                                                       | `Function`                                                                             |
| `destroyEditor`        | `销毁 Editor 对象。`                                                   | `Function`                                                                             |
| `triggerKickout`       | `踢出指定id的用户`                                                     | `(userIds: string[], callback?: (isSuccess: boolean, err?: Error) => void   ) => void` |
| `triggerKickoutOthers` | 提出非创建者之外的所有用户                                             | `(     callback?: (isSuccess: boolean, err?: Error) => void   ) => void`               |
| `triggerKickoutAll`    | 踢出所有的用户                                                         | `(     callback?: (isSuccess: boolean, err?: Error) => void   ) => void`               |
| `triggerForceSave`     | 强制保存文档                                                           | `(     callback?: (isSuccess: boolean, err?: Error) => void   ) => void`               |
| `onlineDocUser`        | 获取当前正在编辑在线的用户                                             | `(     callback?: (docUserList: OnlineDocUser[], err?: Error) => void   ) => void`     |

## IDocEditorProps

其他属性与 [IOfficeEditorProps](#IOfficeEditorProps) 类型，下面就不列举

| 属性     | required | 说明               | 类型    | 默认值 |     |
| -------- | -------- | ------------------ | ------- | ------ | --- |
| `docUrl` | true     | 文档服务器地址     | string  |        |     |
| `user`   | true     | 文档用户信息       | DocUser |        |     |
| `cipher` | true     | 文档服务器加密信息 | string  |        |     |

## `OnlineDocUser`

| 值         | 说明     |
| ---------- | -------- |
| `userId`   | 用户 id  |
| `userName` | 用户名称 |
| `docKey`   | 文档 key |

## DocUser

| 属性       | required | 说明     | 类型   | 默认值 |
| ---------- | -------- | -------- | ------ | ------ |
| `userId`   | true     | 用户 ID  | string |        |
| `username` | true     | 用户名   | string |        |
| `nickname` | false    | 昵称     | string |        |
| `avatar`   | false    | 用户头像 | string |        |

## IEditorApi

| 属性                   | required | 说明                 | 类型                                              | 默认值 |
| ---------------------- | -------- | -------------------- | ------------------------------------------------- | ------ |
| `loadHistoryList`      | false    | 加载历史列表         | () => Promise<Record<string, any>>                |        |
| `loadHistoryData`      | false    | 加载指定版本历史数据 | (version: number) => Promise<Record<string, any>> |        |
| `triggerForceSave`     | false    | 强制保存             | () => Promise<boolean>                            |        |
| `triggerKickout`       | false    | 移除指定用户         | (userIds: string[]) => Promise<boolean>           |        |
| `triggerKickoutOthers` | false    | 移除其他用户         | () => Promise<boolean>                            |        |
| `triggerKickoutAll`    | false    | 移除所有用户         | () => Promise<boolean>                            |        |
| `triggerOnlineDocUser` | false    | 获取在线文档用户     | () => Promise<OnlineDocUser[]>                    |        |
| `triggerRestore`       | false    | 恢复到指定版本       | (version: number) => Promise<boolean>             |        |
| `triggerRename`        | false    | 重命名文档           | (newfilename: string) => Promise<boolean>         |        |

# 版本历史

## @clearx/office-editor-vue2

### 0.1.0

完成从 react 到 vue2 编辑器迁移的编码，保持为 react 属性一致。

### 0.1.1

修改部分属性说明

### 0.2.3

- 新增 `DocEditor` 组件

## @clearx/office-editor-vue3

### 0.1.0

完成从 react 到 vue3 编辑器迁移的编码，保持为 react 属性一致。

### 0.1.1

修改部分属性说明

### 0.2.2

- 新增 `DocEditor` 组件

## @clearx/office-editor-react

### 0.2.3

修改部分属性说明

### 0.3.3

- 新增 `DocEditor` 组件
