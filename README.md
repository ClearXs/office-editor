<p  align="center">
<img src="./docs/logo.png" height="100" align="center">
</p>

<h2 align="center">简约 · 实用 · 前沿 · 创新</h2>

# 编辑器

# 指南

该篇文档用于描述在线文档协作编辑器的使用，目前编辑器支持一下三个主流的版本：

* vue2
* vue3
* react

编辑器的目标主要是封装[onlyoffice](https://www.onlyoffice.com/)提供的编辑器，并且和对应的后端作交互，所以里面包含的接口的请求，
**在开发的时候，需要添加以下的代理来与后端服务进行交互：**

```nginx configuration
'/api': {
    target: 'http://localhost',
    changeOrigin: true
}
```

# vue2

## 快速开始

安装

```bash
npm install @office-editor/vue2@latest
```

其中`OfficeEditor` 为模块包导出的组件，安需要引入自项目中，值得注意的是他在浏览器下的大小是默认的，需要在外层添加来控制他的大小

```tsx
<template>
    <div class="w-[100vw] h-[100vh]">
        <div class="flex gap-2 absolute">
            <el-button size="small"
            @click="editor?.triggerKickout?.(['1'])"
            >踢出
        </el-button
        >
        <el-button size="small"
        @click="editor?.triggerKickoutAll?.()"
        >踢出所有人
    </el-button
    >
    <el-button size="small"
    @click="editor?.triggerKickoutOthers?.()"
    >踢出其他人</el-button
>
<el-button size="small" @click = "editor?.triggerForceSave?.()"
    > 强制保存 < /el-button
    >
    < el - button
size = "small"
@click
= "onlineDocUser" > 在线用户 < /el-button>
</div>
<office-editor
      :docId = "$route.params.id"
printLog
    :onDocumentReady = "onDocumentReady"
:
onDocumentBeforeDestroy = "onDocumentBeforeDestroy"
    > < /office-editor>
</div>
</template>

<script lang="ts">
    import {defineComponent, PropType} from 'vue'
    import {type IEditor, OfficeEditor} from '@office-editor/vue2'

    export default defineComponent({
    components: {OfficeEditor},
    data() {
    return {
    editor: Object as PropType<IEditor>,
}
},

    methods: {
    onDocumentReady(editor: IEditor) {
    this.$message('onDocumentReady')
    this.editor = editor
},
    onDocumentBeforeDestroy() {
    this.$message('onDocumentBeforeDestroy')
    this.editor = undefined
},
    onlineDocUser() {
    this.editor?.onlineDocUser?.((user) => {
    this.$message(JSON.stringify(user))
})
},
},
})
</script>
```

# vue3

## 快速开始

```bash
npm install @office-editor/vue3@latest
```

和vue2写法类似，就不赘述。

```tsx
<template>
    <div class="w-[100vw] h-[100vh]">
        <n-space class="absolute">
            <n-button
            @click="editorRef?.triggerKickout?.(['1'])" type="primary">
            提出
        </n-button>
        <n-button
        @click="editorRef?.triggerKickoutAll()" type="primary">
        提出所有人
    </n-button>
    <n-button
    @click="editorRef?.triggerKickoutOthers()" type="primary">
    提出其他人
</n-button>
<n-button @click = "editorRef?.triggerForceSave()"
type = "primary" >
    强制保存
    < /n-button>
<n-button @click = "onlineDocUser"
type = "primary" > 在线用户 < /n-button>
</n-space>
<office-editor
      :docId = "$route.params.id"
height = "100%"
width = "100%"
:
onDocumentReady = "onDocumentReady"
:
onDocumentBeforeDestroy = "onDocumentBeforeDestroy"
    >
    < /office-editor>
</div>
</template>

<script lang="ts" setup>
    import {OfficeEditor, type IEditor} from '@office-editor/vue3'
    import {useMessage} from 'naive-ui'
    import {ref} from 'vue'

    const message = useMessage()

    const editorRef = ref<IEditor | undefined>()

    const onDocumentBeforeDestroy = () => {
    message.info('onDocumentBeforeDestroy')
}

    const onDocumentReady = (editor: IEditor) => {
    editorRef.value = editor
}

    const onlineDocUser = () => {
    editorRef.value?.onlineDocUser?.((user) => {
        message.info(JSON.stringify(user))
    })
}
</script>
```

# react

## 快速开始

安装，要求react版本>=16

```tsx
npm
install
@office
-editor / react
@latest
```

```tsx
import {IEditor, OfficeEditor} from '@office-editor/react';
import {useParams} from '@umijs/max';
import {Button, Space} from 'antd';
import {useEffect, useRef} from 'react';

const Editor = () => {
    const params = useParams<{ docId: string }>();
    const editorRef = useRef<IEditor | undefined>();

    useEffect(() => {
    }, [params.docId]);

    return (
        <div style={{height: '100vh', width: '100vw'}}>
            <Space style={{position: 'absolute'}}>
                <Button
                    onClick={() => {
                        editorRef.current?.triggerKickout(['1']);
                    }}
                >
                    踢出
                </Button>
                <Button
                    onClick={() => {
                        editorRef.current?.triggerKickoutAll();
                    }}
                >
                    踢出所有人
                </Button>
                <Button
                    onClick={() => {
                        editorRef.current?.triggerKickoutOthers();
                    }}
                >
                    踢出其他人
                </Button>
                <Button
                    onClick={() => {
                        editorRef.current?.triggerForceSave();
                    }}
                >
                    强制保存
                </Button>
                <Button
                    onClick={() => {
                        editorRef.current?.onlineDocUser((user) => {
                            console.log(user);
                        });
                    }}
                >
                    在线用户
                </Button>
            </Space>
            <OfficeEditor
                docId={params.docId as string}
                printLog={true}
                onDocumentReady={(editor) => (editorRef.current = editor)}
                onDocumentBeforeDestroy={() => {
                    console.log(this);
                }}
            />
        </div>
    );
};

export default Editor;
```

# API

vue2、vue3、react框架属性保持一致，各个属性在各个框架作用都相同。

## `IOfficeEditorProps`

`OfficeEditor` 组件属性

| 属性                             | required | 说明                                                                                               | 类型                                                      | 默认值                                                                                                                                            |
|--------------------------------|----------|--------------------------------------------------------------------------------------------------|---------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `docId`                        | true     | 必传，`文档唯一ID`，通过接口获取文档数据的id值                                                                       | string                                                  |                                                                                                                                                |
| `height`                       | false    | `定义浏览器窗口中的文档高度。`                                                                                 | string                                                  | 100%                                                                                                                                           |
| `width`                        | false    | `定义浏览器窗口中的文档宽度。`                                                                                 | string                                                  | 100%                                                                                                                                           |
| `action`                       | false    | 编辑器操作，默认为edit                                                                                    | `EditorAction`                                          | edit                                                                                                                                           |
| `type`                         | false    | 编辑器类型，默认为desktop                                                                                 | `EditorType`                                            | destop                                                                                                                                         |
| `printLog`                     | false    | 是否打印日志                                                                                           | boolean                                                 | true                                                                                                                                           |
| `config`                       | false    | 编辑器配置                                                                                            | `Config`                                                | {    logo: undefined,    plugins: true,    integrationMode: 'embed',    spellcheck: true,    unit: 'cm',    hideNotes: false,    zoom: 100,  } |
| `onDocumentReady`              | false    | 将文档加载到文档编辑器时调用的函数。                                                                               | `(editor: IEditor) => void`                             |                                                                                                                                                |
| `onLoadComponentError`         | false    | 加载组件时发生错误时调用的函数。                                                                                 | `(errorCode: number, errorDescription: string) => void` |                                                                                                                                                |
| `onMetaChange`                 | false    | 通过 meta 命令更改文档的元信息时调用的函数。                                                                        | `(meta: any) => void`                                   |                                                                                                                                                |
| `onInfo`                       | false    | 应用程序打开文件时调用的函数。                                                                                  | `(info: any) => void`                                   |                                                                                                                                                |
| `onWarning`                    | false    | info信息调用的函数                                                                                      | `(warning: any) => void`                                |                                                                                                                                                |
| `onError`                      | false    | 发生错误或其他特定事件时调用的函数。[错误码说明](https://github.com/ONLYOFFICE/sdkjs/blob/master/common/errorCodes.js)： | `(error: any) => void`                                  |                                                                                                                                                |
| `onRequestSharingSettings`     | false    | 当用户尝试通过单击 "更改访问权限" 按钮来管理文档访问权限时调用的函数。                                                            | `(settings?: any) => void`                              |                                                                                                                                                |
| `onRequestRename`              | false    | 当用户尝试通过单击 "重命名..." 按钮重命名文件时调用的函数。                                                                | `(rename: any) => void`                                 |                                                                                                                                                |
| `onMakeActionLink`             | false    | 当用户试图获取打开包含书签的文档的链接时调用的函数，滚动到书签位置。                                                               | `(link: any) => void`                                   |                                                                                                                                                |
| `onRequestInsertImage`         | false    | 当用户尝试通过单击 "来自存储的图像" 按钮插入图像时调用的函数。                                                                | `(insertImages: any) => void`                           |                                                                                                                                                |
| `onRequestMailMergeRecipients` | false    | 当用户尝试通过单击 "邮件合并" 按钮来选择收件人数据时调用的函数。                                                               | ` (mail: any) => void`                                  |                                                                                                                                                |
| `onRequestCompareFile`         | false    | 当用户尝试通过单击 "存储中的文档" 按钮来选择要比较的文档时调用的函数。                                                            | `(file: any) => void`                                   |                                                                                                                                                |
| `onRequestEditRights`          | false    | 当用户尝试通过单击 "编辑文档" 按钮将文档从查看模式切换到编辑模式时调用的函数。                                                        | `(right: any) => void`                                  |                                                                                                                                                |
| `onRequestHistory`             | false    | 当用户尝试通过单击 "版本历史记录" 按钮来显示文档版本历史记录时调用的函数。                                                          | `() => void`                                            |                                                                                                                                                |
| `onRequestHistoryData`         | false    | 当用户试图单击文档版本历史记录中的特定文档版本时调用的函数。                                                                   | `(version: number) => void`                             |                                                                                                                                                |
| `onRequestHistoryClose`        | false    | 当用户试图通过单击 "关闭历史记录" 按钮从查看文档版本历史记录返回到文档时调用的函数。                                                     | `() => void`                                            |                                                                                                                                                |
| `onRequestRestore`             | false    | 当用户尝试通过单击版本历史记录中的 "恢复" 按钮来恢复文件版本时调用的函数。                                                          | `(history: any) => void`                                |                                                                                                                                                |
| `onDocumentStateChange`        | false    | 文档状态变更时回调                                                                                        | `(state: any) => void`                                  |                                                                                                                                                |
| `onDocumentBeforeDestroy`      | false    | 当文档组件销毁前回调                                                                                       | `() => void`                                            |                                                                                                                                                |

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
    | 'blockcontent'
```

| 值            | 说明   |
|--------------|------|
| edit         | 编辑   |
| review       | 预览   |
| view         | 浏览   |
| embedded     | 嵌入   |
| filter       |      |
| chat         |      |
| fillForms    | 填充表单 |
| blockcontent |      |

## `EditorType`

```tsx
type EditorType = 'desktop' | 'mobile' | 'embedded'
```

| 值        | 说明   |
|----------|------|
| destop   | 桌面端  |
| mobile   | 移动端  |
| embedded | 嵌入式端 |

## `Config`

| 属性                | required | 说明                                                                | 类型                       | 默认值       |
|-------------------|----------|-------------------------------------------------------------------|--------------------------|-----------|
| `logo`            | false    | logo                                                              | `Logo`                   | undefined |
| `plugins`         | false    | 定义插件是否将启动并可用。默认值是true。                                            | boolean                  | true      |
| `integrationMode` | false    | 定义将编辑器嵌入网页的模式。由于未捕获焦点，嵌入值在加载编辑器框架时会禁用滚动到编辑器框架                     | string                   | embed     |
| `spellcheck`      | false    | 定义加载编辑器时是否自动打开或关闭拼写检查器。默认为true                                    | boolean                  | false     |
| `unit`            | false    | 定义标尺和对话框中使用的测量单位。\ncm: centimeters\npt: points\ninch: inches默认取cm | `'cm' \| 'pt' \| 'inch'` | `cm`      |
| `hideNotes`       | false    | 定义在首次加载时是否显示或隐藏注释面板.默认值为 false。此参数仅适用于演示文稿编辑器。                    | boolean                  | false     |
| `zoom`            | false    | 定义以百分比为单位的文档显示缩放值,默认值为100                                         | number                   | 100       |

## `Logo`

| 属性              | required | 说明        | 类型     | 默认值 |
|-----------------|----------|-----------|--------|-----|
| `image`         | false    | logo图片地址  | string |     |
| `imageDark`     | false    | 深色主题图片地址  | string |     |
| `imageEmbedded` | false    | 嵌入式的图片地址  | string |     |
| `url`           | false    | 点击图片跳转的地址 | string |     |

## `IEditor`

`IEditor` 类型的对象可以通过 `IOfficeEditorProps` 参数中 `onDocumentReady?: (editor: IEditor) => void` 的回调获取。

| 属性                     | 说明                                  | 类型                                                                                     |
|------------------------|-------------------------------------|----------------------------------------------------------------------------------------|
| `createConnector`      | 创建连接器以与外部的文本文档、电子表格、演示文稿和可填写表单进行交互。 | `Function`                                                                             |
| `refreshHistory`       | 刷新历史数据                              | `Function`                                                                             |
| `setHistoryData`       | 设置历史数据                              | `Function`                                                                             |
| `requestClose`         | 请求关闭编辑器。                            | `Function`                                                                             |
| `destroyEditor`        | `销毁 Editor 对象。`                     | `Function`                                                                             |
| `triggerKickout`       | `踢出指定id的用户`                         | `(userIds: string[], callback?: (isSuccess: boolean, err?: Error) => void   ) => void` |
| `triggerKickoutOthers` | 提出非创建者之外的所有用户                       | `(     callback?: (isSuccess: boolean, err?: Error) => void   ) => void`               |
| `triggerKickoutAll`    | 踢出所有的用户                             | `(     callback?: (isSuccess: boolean, err?: Error) => void   ) => void`               |
| `triggerForceSave`     | 强制保存文档                              | `(     callback?: (isSuccess: boolean, err?: Error) => void   ) => void`               |
| `onlineDocUser`        | 获取当前正在编辑在线的用户                       | `(     callback?: (docUserList: OnlineDocUser[], err?: Error) => void   ) => void`     |

## `OnlineDocUser`

| 值          | 说明    |
|------------|-------|
| `userId`   | 用户id  |
| `userName` | 用户名称  |
| `docKey`   | 文档key |

# 版本历史

## @office-editor/vue2

最新版本为**0.1.1**

### 0.1.0

完成从react到vue2编辑器迁移的编码，保持为react属性一致。

### 0.1.1

修改部分属性说明

## @office-editor/vue3

最新版本为**0.1.1**

### 0.1.0

完成从react到vue3编辑器迁移的编码，保持为react属性一致。

### 0.1.1

修改部分属性说明

## @office-editor/react

最新版本为**0.2.3**

### 0.2.3

修改部分属性说明
