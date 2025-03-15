import Result from './model/result';
import { DocumentEditorConfig } from '../interface';
import { AxiosRequest } from '../hook/useRequest';

export const useEditorApi = (request: AxiosRequest) => {
  const editor = (
    docId: string,
    action?: string,
    type?: string,
    actionLink?: string,
    directUrl?: string
  ): Promise<Result<DocumentEditorConfig>> => {
    return request
      .get('/office/editor', {
        docId,
        action,
        type,
        actionLink,
        directUrl,
      })
      .then((res) => {
        return res.data;
      });
  };

  return { editor };
};
