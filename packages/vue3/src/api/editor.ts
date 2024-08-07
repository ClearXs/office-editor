import useRequest from './request';
import Result from './result';
import { Mentions } from '../model/mention';
import { IConfig } from '@onlyoffice/document-editor-vue';

export type DocumentEditorConfig = {
  model: IConfig;
  fileHistory: string[];
  documentServerUrl: string;
  docserviceApiUrl: string;
  dataInsertImage: string;
  dataCompareFile: string;
  dataMailMergeRecipients: string;
  usersForMentions: Mentions[];
};

export const useEditorApi = () => {
  const request = useRequest();

  const editor = (
    docId: string,
    action?: string,
    type?: string,
    actionLink?: string,
    directUrl?: string
  ): Promise<Result<DocumentEditorConfig>> => {
    return request
      .get('/api/office/editor', {
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
