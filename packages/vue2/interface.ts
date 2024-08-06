import { IEditor } from './model/config'

export type EditorAction =
  | 'edit'
  | 'review'
  | 'view'
  | 'embedded'
  | 'filter'
  | 'comment'
  | 'chat'
  | 'fillForms'
  | 'blockcontent'

export type EditorType = 'desktop' | 'mobile' | 'embedded'

export type Config = {
  logo?: Logo
  // 定义插件是否将启动并可用。默认值是true。
  plugins?: boolean
  // 定义将编辑器嵌入网页的模式。由于未捕获焦点，嵌入值在加载编辑器框架时会禁用滚动到编辑器框架。 默认为空
  integrationMode?: 'embed'
  // 定义加载编辑器时是否自动打开或关闭拼写检查器。默认为true
  spellcheck?: boolean
  // 定义标尺和对话框中使用的测量单位。
  // cm: centimeters
  // pt: points
  // inch: inches
  // 默认取cm
  unit?: 'cm' | 'pt' | 'inch'
  // 定义在首次加载时是否显示或隐藏注释面板.默认值为 false。此参数仅适用于演示文稿编辑器。
  hideNotes?: boolean
  // 定义以百分比为单位的文档显示缩放值,默认值为100
  zoom?: number
}

export type Logo = {
  // 图像地址
  image?: string
  // 深色主题地址
  imageDark?: string
  //
  imageEmbedded?: string
  // 点击图片时挑战的地址
  url?: string
}

/**
 * 文档办公编辑器参数，组装自onlyoffice
 * @see https://api.onlyoffice.com/zh/editors/react
 */
export type IOfficeEditorProps = {
  /**
   * 文档唯一ID
   */
  docId: string

  /**
   * 定义浏览器窗口中的文档高度。
   */
  height?: string

  /**
   * 编辑器操作，默认为edit
   */
  action?: EditorAction

  /**
   * 编辑器类型，默认为desktop
   */
  type?: EditorType

  /**
   * 定义浏览器窗口中的文档宽度。
   */
  width?: string

  /**
   * 是否打印日志
   */
  printLog?: boolean

  /**
   * 编辑器配置
   */
  config?: Config

  /**
   * 将文档加载到文档编辑器时调用的函数。
   *
   * @param editor
   */
  onDocumentReady?: (editor: IEditor) => void

  /**
   * 加载组件时发生错误时调用的函数。
   *
   * @param errorCode
   * @param errorDescription
   */
  onLoadComponentError?: (errorCode: number, errorDescription: string) => void

  /**
   * 通过 meta 命令更改文档的元信息时调用的函数。

   * @param meta 
   */
  onMetaChange?: (meta: any) => void

  /**
   * info信息调用的函数
   *
   * @param info
   */
  onInfo?: (info: any) => void

  /**
   * 发生警告时调用的函数。
   *
   * @param warning
   */
  onWarning?: (warning: any) => void

  /**
   * 发生错误或其他特定事件时调用的函数。
   *
   * @param error
   */
  onError?: (error: any) => void

  /**
   * 当用户尝试通过单击 “更改访问权限” 按钮来管理文档访问权限时调用的函数。
   *
   * @param settings
   */
  onRequestSharingSettings?: (settings?: any) => void

  /**
   * 当用户尝试通过单击 “重命名...” 按钮重命名文件时调用的函数。
   *
   * @param rename
   */
  onRequestRename?: (rename: any) => void

  /**
   * 当用户试图获取打开包含书签的文档的链接时调用的函数，滚动到书签位置。
   *
   * @param link
   * @returns
   */
  onMakeActionLink?: (link: any) => void

  /**
   * 当用户尝试通过单击 “来自存储的图像” 按钮插入图像时调用的函数。
   *
   * @param insertImages
   */
  onRequestInsertImage?: (insertImages: any) => void

  /**
   * 当用户尝试通过单击 “邮件合并” 按钮来选择收件人数据时调用的函数。
   *
   * @param mail
   */
  onRequestMailMergeRecipients?: (mail: any) => void

  /**
   * 当用户尝试通过单击 “存储中的文档” 按钮来选择要比较的文档时调用的函数。
   *
   * @param file
   */
  onRequestCompareFile?: (file: any) => void

  /**
   * 当用户尝试通过单击 “编辑文档” 按钮将文档从查看模式切换到编辑模式时调用的函数。
   *
   * @param right
   * @returns
   */
  onRequestEditRights?: (right: any) => void

  /**
   * 当用户尝试通过单击 “版本历史记录” 按钮来显示文档版本历史记录时调用的函数。
   */
  onRequestHistory?: () => void

  /**
   * 当用户试图单击文档版本历史记录中的特定文档版本时调用的函数。
   *
   * @param version
   */
  onRequestHistoryData?: (version: number) => void

  /**
   * 当用户试图通过单击 “关闭历史记录” 按钮从查看文档版本历史记录返回到文档时调用的函数。
   */
  onRequestHistoryClose?: () => void

  /**
   * 当用户尝试通过单击版本历史记录中的 “恢复” 按钮来恢复文件版本时调用的函数。
   */
  onRequestRestore?: (history: any) => void

  /**
   * 文档状态变更时回调
   */
  onDocumentStateChange?: (state: any) => void

  /**
   * 当文档组件销毁前回调
   */
  onDocumentBeforeDestroy?: () => void
}
