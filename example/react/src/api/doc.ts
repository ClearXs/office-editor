import useRequest from '@/hook/request';
import useApi from './api';
import { Api, Model } from './interface';

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
   * ONLYOFFICE唯一标识
   */
  onlyofficeKey: string;

  /**
   * 文件
   */
  file: string;

  /**
   * 拥有者
   */
  creator: string;
};

export type DocApi = Api<Doc> & {
  getHistory: (docId: string) => Promise<Record<string, any>>;
  getHistoryData: (
    docId: string,
    version: string,
  ) => Promise<Record<string, any>>;
};

const useDocApi = (): DocApi => {
  const request = useRequest();

  const api = useApi('/office/doc');
  return {
    ...api,
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
  };
};

export default useDocApi;
