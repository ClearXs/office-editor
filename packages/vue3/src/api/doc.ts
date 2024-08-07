import useRequest from './request';
import useApi from './api';
import { Api, Model } from './interface';
import Result from './result';

export type Doc = Model & {
  /**
   * 文档名称
   */
  title: string;

  /**
   * 文档标签
   */
  label: string;

  /**
   * 文档唯一标识
   */
  key: string;

  /**
   * 文件数据
   */
  file: string;

  /**
   * 拥有者
   */
  creator: string;

  /**
   * 版本号
   */
  docVersion: number;
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

export type DocApi = Api<Doc> & {
  rename: (
    docId: string,
    rename: {
      newfilename: string;
      dockey?: string;
      ext?: string;
    }
  ) => Promise<Result<boolean>>;
  restore: (docId: string, version: number) => Promise<Result<boolean>>;
  getHistory: (docId: string) => Promise<Result<Record<string, any>>>;
  getHistoryData: (
    docId: string,
    version: number
  ) => Promise<Result<Record<string, any>>>;
  forceSave: (docId: string) => Promise<Result<boolean>>;
  kickout: (docId: string, userIds: string[]) => Promise<Result<boolean>>;
  kickoutOthers: (docId: string) => Promise<Result<boolean>>;
  kickoutAll: (docId: string) => Promise<Result<boolean>>;
  getOnlineDocUser: (docId: string) => Promise<Result<OnlineDocUser[]>>;
};

const useDocApi = (): DocApi => {
  const request = useRequest();
  const api = useApi<Doc>('/api/office/doc');

  return {
    ...api,
    rename(docId, rename): Promise<Result<boolean>> {
      return request
        .put(`/api/office/doc/rename/${docId}`, { ...rename })
        .then((res) => {
          return res.data;
        });
    },
    restore(docId, version): Promise<Result<boolean>> {
      return request
        .put(`/api/office/doc/restore/${docId}/${version}`)
        .then((res) => {
          return res.data;
        });
    },
    getHistory(docId) {
      return request.get(`/api/office/doc/history/${docId}`).then((res) => {
        return res.data;
      });
    },
    getHistoryData(docId, version) {
      return request
        .get(`/api/office/doc/historyData/${docId}/${version}`)
        .then((res) => {
          return res.data;
        });
    },
    forceSave(docId) {
      return request.get(`/api/office/doc/forceSave/${docId}`).then((res) => {
        return res.data;
      });
    },
    kickout(docId, userIds) {
      return request
        .post(`/api/office/doc/kickout/${docId}`, userIds)
        .then((res) => {
          return res.data;
        });
    },
    kickoutOthers(docId) {
      return request
        .post(`/api/office/doc/kickoutOthers/${docId}`)
        .then((res) => {
          return res.data;
        });
    },
    kickoutAll(docId) {
      return request.post(`/api/office/doc/kickoutAll/${docId}`).then((res) => {
        return res.data;
      });
    },
    getOnlineDocUser(docId) {
      return request
        .get(`/api/office/doc/getOnlineDocUser/${docId}`)
        .then((res) => {
          return res.data;
        });
    },
  };
};

export default useDocApi;
