import { OnlineDocUser } from 'api/doc';

export type DocConfig = {
  documentType?: string;
  height?: string;
  token?: string;
  type?: string;
  width?: string;
  document?: {
    fileType: string;
    key: string;
    referenceData?: {
      fileKey: string;
      instanceId: string;
      key: string;
    };
    title: string;
    url: string;
    info?: {
      owner?: string;
      uploaded?: string;
      favorite?: boolean;
      folder?: string;
      sharingSettings?: any[];
    };
    permissions?: {
      /**
       * @deprecated Deprecated since version 5.5, please add the onRequestRestore field instead.
       */
      changeHistory?: boolean;
      chat?: boolean;
      comment?: boolean;
      commentGroups?: any;
      copy?: boolean;
      deleteCommentAuthorOnly?: boolean;
      download?: boolean;
      edit?: boolean;
      editCommentAuthorOnly?: boolean;
      fillForms?: boolean;
      modifyContentControl?: boolean;
      modifyFilter?: boolean;
      print?: boolean;
      protect?: boolean;
      /**
       * @deprecated Deprecated since version 6.0, please add the onRequestRename field instead.
       */
      rename?: boolean;
      review?: boolean;
      reviewGroups?: string[];
      userInfoGroups?: string[];
    };
  };
  editorConfig?: {
    actionLink?: any;
    callbackUrl?: string;
    coEditing?: {
      mode: string;
      change: boolean;
    };
    createUrl?: string;
    lang?: string;
    location?: string;
    mode?: string;
    recent?: any[];
    region?: string;
    templates?: any[];
    user?: {
      /**
       * @deprecated Deprecated since version 4.2, please use name instead.
       */
      firstname?: string;
      group?: string;
      id?: string;
      image?: string;
      /**
       * @deprecated Deprecated since version 4.2, please use name instead.
       */
      lastname?: string;
      name?: string;
    };
    customization?: {
      anonymous?: {
        request?: boolean;
        label?: string;
      };
      autosave?: boolean;
      /**
       * @deprecated Deprecated since version 7.1, please use the document.permissions.chat parameter instead.
       */
      chat?: boolean;
      /**
       * @deprecated Deprecated since version 6.3, please use the document.permissions.editCommentAuthorOnly and document.permissions.deleteCommentAuthorOnly fields instead.
       */
      commentAuthorOnly?: boolean;
      comments?: boolean;
      compactHeader?: boolean;
      compactToolbar?: boolean;
      compatibleFeatures?: boolean;
      customer?: {
        address?: string;
        info?: string;
        logo?: string;
        logoDark?: string;
        mail?: string;
        name?: string;
        phone?: string;
        www?: string;
      };
      features?: any;
      feedback?: any;
      forcesave?: boolean;
      goback?: any;
      help?: boolean;
      hideNotes?: boolean;
      hideRightMenu?: boolean;
      hideRulers?: boolean;
      integrationMode?: string;
      logo?: {
        image?: string;
        imageDark?: string;
        imageEmbedded?: string;
        url?: string;
      };
      macros?: boolean;
      macrosMode?: string;
      mentionShare?: boolean;
      mobileForceView?: boolean;
      plugins?: boolean;
      review?: {
        hideReviewDisplay?: boolean;
        hoverMode?: boolean;
        reviewDisplay?: string;
        showReviewChanges?: boolean;
        trackChanges?: boolean;
      };
      /**
       * @deprecated Deprecated since version 7.0. Please use the review.reviewDisplay parameter instead.
       */
      reviewDisplay?: string;
      /**
       * @deprecated Deprecated since version 7.0. Please use the review.showReviewChanges parameter instead.
       */
      showReviewChanges?: boolean;
      /**
       * @deprecated Deprecated since version 7.1. Please use the features.spellcheck parameter instead.
       */
      spellcheck?: boolean;
      submitForm?: boolean;
      toolbarHideFileName?: boolean;
      toolbarNoTabs?: boolean;
      /**
       * @deprecated Deprecated since version 7.0. Please use the review.trackChanges parameter instead.
       */
      trackChanges?: boolean;
      uiTheme?: string;
      unit?: string;
      zoom?: number;
    };
    embedded?: {
      embedUrl?: string;
      fullscreenUrl?: string;
      saveUrl?: string;
      shareUrl?: string;
      toolbarDocked?: string;
    };
    plugins?: {
      autostart?: string[];
      pluginsData?: string[];
      /**
       * @deprecated Deprecated since version 4.3, please use the absolute URLs in pluginsData field.
       */
      url?: string;
    };
  };
  events?: {
    onAppReady?: (event: object) => void;
    onCollaborativeChanges?: (event: object) => void;
    onDocumentReady?: (event: object) => void;
    onDocumentStateChange?: (event: object) => void;
    onDownloadAs?: (event: object) => void;
    onError?: (event: object) => void;
    onInfo?: (event: object) => void;
    onMetaChange?: (event: object) => void;
    onMakeActionLink?: (event: object) => void;
    onOutdatedVersion?: (event: object) => void;
    onPluginsReady?: (event: object) => void;
    onReady?: (event: object) => void;
    onRequestClose?: (event: object) => void;
    /**
     * @deprecated Deprecated since version 7.5, please use onRequestSelectDocument instead.
     */
    onRequestCompareFile?: (event: object) => void;
    onRequestCreateNew?: (event: object) => void;
    onRequestEditRights?: (event: object) => void;
    onRequestHistory?: (event: object) => void;
    onRequestHistoryClose?: (event: object) => void;
    onRequestHistoryData?: (event: object) => void;
    onRequestInsertImage?: (event: object) => void;
    /**
     * @deprecated Deprecated since version 7.5, please use onRequestSelectSpreadsheet instead.
     */
    onRequestMailMergeRecipients?: (event: object) => void;
    onRequestOpen?: (event: object) => void;
    onRequestReferenceData?: (event: object) => void;
    onRequestReferenceSource?: (event: object) => void;
    onRequestRename?: (event: object) => void;
    onRequestRestore?: (event: object) => void;
    onRequestSaveAs?: (event: object) => void;
    onRequestSelectDocument?: (event: object) => void;
    onRequestSelectSpreadsheet?: (event: object) => void;
    onRequestSendNotify?: (event: object) => void;
    onRequestSharingSettings?: (event: object) => void;
    onRequestUsers?: (event: object) => void;
    onWarning?: (event: object) => void;
  };
};

export type IEditor = {
  /**
   * 创建连接器以与外部的文本文档、电子表格、演示文稿和可填写表单进行交互。
   */
  createConnector: Function;

  /**
   * 刷新历史数据
   */
  refreshHistory: Function;

  /**
   * 设置历史数据
   */
  setHistoryData: Function;

  /**
   * 请求关闭编辑器。
   */
  requestClose: Function;

  /**
   * 销毁 docEditor 对象。
   */
  destroyEditor: Function;

  /**
   * 踢出指定id的用户
   */
  triggerKickout: (
    userIds: string[],
    callback?: (isSuccess: boolean, err?: Error) => void
  ) => void;

  /**
   * 提出非创建者之外的所有用户
   */
  triggerKickoutOthers: (
    callback?: (isSuccess: boolean, err?: Error) => void
  ) => void;

  /**
   * 踢出所有的用户
   */
  triggerKickoutAll: (
    callback?: (isSuccess: boolean, err?: Error) => void
  ) => void;

  /**
   * 强制保存文档
   */
  triggerForceSave: (
    callback?: (isSuccess: boolean, err?: Error) => void
  ) => void;

  /**
   * 获取当前正在编辑在线的用户
   */
  onlineDocUser: (
    callback?: (docUserList: OnlineDocUser[], err?: Error) => void
  ) => void;
};
