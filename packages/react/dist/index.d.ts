import { OnlineDocUser as OnlineDocUser$1 } from 'api/doc';

type DocConfig = {
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
type IDocEditorProps = {
    /**
     * 创建连接器以与外部的文本文档、电子表格、演示文稿和可填写表单进行交互。
  
     */
    createConnector: Function;
    /**
     * 刷新缓存数据
     */
    refreshHistory: Function;
    /**
     * 设置缓存数据
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
    triggerKickout: (userIds: string[], callback?: (isSuccess: boolean, err?: Error) => void) => void;
    /**
     * 提出非创建者之外的所有用户
     */
    triggerKickoutOthers: (callback?: (isSuccess: boolean, err?: Error) => void) => void;
    /**
     * 踢出所有的用户
     */
    triggerKickoutAll: (callback?: (isSuccess: boolean, err?: Error) => void) => void;
    /**
     * 强制保存文档
     */
    triggerForceSave: (callback?: (isSuccess: boolean, err?: Error) => void) => void;
    /**
     * 获取当前正在编辑在线的用户
     */
    onlineDocUser: (callback?: (docUserList: OnlineDocUser$1[], err?: Error) => void) => void;
};

type EditorAction = 'edit' | 'review' | 'view' | 'embedded' | 'filter' | 'comment' | 'chat' | 'fillForms' | 'blockcontent';
type EditorType = 'desktop' | 'mobile' | 'embedded';
/**
 * 文档办公编辑器参数，组装自onlyoffice
 * @see https://api.onlyoffice.com/zh/editors/react
 */
type IOfficeEditorProps = {
    /**
     * 文档唯一ID
     */
    docId: string;
    /**
     * 定义浏览器窗口中的文档高度。
     */
    height?: string;
    /**
     * 编辑器操作，默认为edit
     */
    action?: EditorAction;
    /**
     * 编辑器类型，默认为desktop
     */
    type?: EditorType;
    /**
     * 定义浏览器窗口中的文档宽度。
     */
    width?: string;
    /**
     * 是否打印日志
     */
    printLog?: boolean;
    /**
     * 编辑器配置
     */
    config?: {
        logo?: {
            image?: string;
            imageDark?: string;
            imageEmbedded?: string;
            url?: string;
        };
        plugins?: boolean;
        integrationMode?: 'embed';
        spellcheck?: boolean;
        unit?: 'cm' | 'pt' | 'inch';
        hideNotes?: boolean;
        zoom?: number;
    };
    /**
     * 将文档加载到文档编辑器时调用的函数。
     *
     * @param docEditor
     */
    onDocumentReady?: (docEditor: IDocEditorProps) => void;
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
     * 应用程序打开文件时调用的函数。
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

declare const OfficeEditor: React.FC<IOfficeEditorProps>;

type OnlineDocUser = {
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

export { type DocConfig, type EditorAction, type EditorType, type IDocEditorProps, type IOfficeEditorProps, OfficeEditor, type OnlineDocUser };
