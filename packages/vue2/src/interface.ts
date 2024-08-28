import { Mentions } from './model/mention';
import { DocConfig, IEditor } from './model/config';

export type DocumentEditorConfig = {
  model: DocConfig;
  fileHistory: string[];
  documentServerUrl: string;
  docserviceApiUrl: string;
  dataInsertImage: string;
  dataCompareFile: string;
  dataMailMergeRecipients: string;
  usersForMentions: Mentions[];
};

export type OnlineDocUser = {
  /**
   * 用户id
   */
  userId: string;

  /**
   * 用户名称
   */
  userName: string;

  /**
   * 文档key
   */
  docKey: string;
};

export interface IEditorApi {
  loadHistoryList?: () => Promise<Record<string, any>>;
  loadHistoryData?: (version: number) => Promise<Record<string, any>>;
  triggerForceSave?: () => Promise<boolean>;
  triggerKickout?: (userIds: string[]) => Promise<boolean>;
  triggerKickoutOthers?: () => Promise<boolean>;
  triggerKickoutAll?: () => Promise<boolean>;
  triggerOnlineDocUser?: () => Promise<OnlineDocUser[]>;
  triggerRestore?: (version: number) => Promise<boolean>;
  triggerRename?: (newfilename: string) => Promise<boolean>;
}

/**
 * 文档办公编辑器参数，组装自onlyoffice
 * @see https://api.onlyoffice.com/zh/editors/react
 */
export type IOfficeEditorProps = {
  /**
   * 编辑器唯一id
   */
  id: string;

  /**
   * 编辑器配置
   */
  config: DocumentEditorConfig;

  /**
   * 提供给编辑器外部文档相关的api
   */
  api: IEditorApi;

  /**
   * 定义浏览器窗口中的文档高度。
   */
  height?: string;

  /**
   * 定义浏览器窗口中的文档宽度。
   */
  width?: string;

  /**
   * 是否打印日志
   */
  printLog?: boolean;

  /**
   * 将文档加载到文档编辑器时调用的函数。
   *
   * @param editor
   */
  onDocumentReady?: (editor: IEditor) => void;

  /**
   * 加载组件时发生错误时调用的函数。
   *
   * @param errorCode
   * @param errorDescription
   */
  onLoadComponentError?: (errorCode: number, errorDescription: string) => void;

  /**
   * 通过 meta 命令更改文档的元信息时调用的函数。
   * @param meta
   */
  onMetaChange?: (meta: any) => void;

  /**
   * info信息调用的函数
   *
   * @param info
   */
  onInfo?: (info: any) => void;

  /**
   * 发生警告时调用的函数。
   *
   * @param warning
   */
  onWarning?: (warning: any) => void;

  /**
   * 发生错误或其他特定事件时调用的函数。
   *
   * @param error
   */
  onError?: (error: any) => void;

  /**
   * 当用户尝试通过单击 “更改访问权限” 按钮来管理文档访问权限时调用的函数。
   *
   * @param settings
   */
  onRequestSharingSettings?: (settings?: any) => void;

  /**
   * 当用户尝试通过单击 “重命名...” 按钮重命名文件时调用的函数。
   *
   * @param rename
   */
  onRequestRename?: (rename: any) => void;

  /**
   * 当用户试图获取打开包含书签的文档的链接时调用的函数，滚动到书签位置。
   *
   * @param link
   * @returns
   */
  onMakeActionLink?: (link: any) => void;

  /**
   * 当用户尝试通过单击 “来自存储的图像” 按钮插入图像时调用的函数。
   *
   * @param insertImages
   */
  onRequestInsertImage?: (insertImages: any) => void;

  /**
   * 当用户尝试通过单击 “邮件合并” 按钮来选择收件人数据时调用的函数。
   *
   * @param mail
   */
  onRequestMailMergeRecipients?: (mail: any) => void;

  /**
   * 当用户尝试通过单击 “存储中的文档” 按钮来选择要比较的文档时调用的函数。
   *
   * @param file
   */
  onRequestCompareFile?: (file: any) => void;

  /**
   * 当用户尝试通过单击 “编辑文档” 按钮将文档从查看模式切换到编辑模式时调用的函数。
   *
   * @param right
   * @returns
   */
  onRequestEditRights?: (right: any) => void;

  /**
   * 当用户尝试通过单击 “版本历史记录” 按钮来显示文档版本历史记录时调用的函数。
   */
  onRequestHistory?: () => void;

  /**
   * 当用户试图单击文档版本历史记录中的特定文档版本时调用的函数。
   *
   * @param version
   */
  onRequestHistoryData?: (version: number) => void;

  /**
   * 当用户试图通过单击 “关闭历史记录” 按钮从查看文档版本历史记录返回到文档时调用的函数。
   */
  onRequestHistoryClose?: () => void;

  /**
   * 当用户尝试通过单击版本历史记录中的 “恢复” 按钮来恢复文件版本时调用的函数。
   */
  onRequestRestore?: (history: any) => void;

  /**
   * 文档状态变更时回调
   */
  onDocumentStateChange?: (state: any) => void;

  /**
   * 当文档组件销毁前回调
   */
  onDocumentBeforeDestroy?: () => void;
};
