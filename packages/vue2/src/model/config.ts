import { OnlineDocUser } from '../api/doc'

export type IEditor = {
  /**
   * 创建连接器以与外部的文本文档、电子表格、演示文稿和可填写表单进行交互。
   */
  createConnector: Function

  /**
   * 刷新历史数据
   */
  refreshHistory: Function

  /**
   * 设置历史数据
   */
  setHistoryData: Function

  /**
   * 请求关闭编辑器。
   */
  requestClose: Function

  /**
   * 销毁 docEditor 对象。
   */
  destroyEditor: Function

  /**
   * 踢出指定id的用户
   */
  triggerKickout: (
    userIds: string[],
    callback?: (isSuccess: boolean, err?: Error) => void
  ) => void

  /**
   * 提出非创建者之外的所有用户
   */
  triggerKickoutOthers: (
    callback?: (isSuccess: boolean, err?: Error) => void
  ) => void

  /**
   * 踢出所有的用户
   */
  triggerKickoutAll: (
    callback?: (isSuccess: boolean, err?: Error) => void
  ) => void

  /**
   * 强制保存文档
   */
  triggerForceSave: (
    callback?: (isSuccess: boolean, err?: Error) => void
  ) => void

  /**
   * 获取当前正在编辑在线的用户
   */
  onlineDocUser: (
    callback?: (docUserList: OnlineDocUser[], err?: Error) => void
  ) => void
}
