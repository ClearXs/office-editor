import useRequest from './hook/useRequest';
import {
  DocumentEditorConfig,
  IDocEditorProps,
  IOfficeEditorProps,
} from './interface';
import OfficeEditor from 'OfficeEditor';
import { useEffect, useMemo, useState } from 'react';
import { toast, ToastContainer } from 'react-toast';
import useDocApi from './services/doc';
import { useEditorApi } from './services/editor';

const DocEditor: React.FC<IDocEditorProps> = ({
  docUrl,
  user,
  cipher,
  id,
  ...props
}) => {
  const request = useRequest(docUrl, user, cipher);
  const editorApi = useEditorApi(request);
  const docApi = useDocApi(request);
  const [config, setConfig] = useState<DocumentEditorConfig>();

  useEffect(() => {
    editorApi
      .editor(id)
      .then((res) => {
        const { code, data, message } = res;
        if (code === 200) {
          setConfig(data);
        } else {
          toast.error(message);
        }
      })
      .catch((err) => toast.error(err));
  }, [id]);

  const api: IOfficeEditorProps['api'] = useMemo(() => {
    return {
      loadHistoryList() {
        return docApi.getHistory(id).then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            return data;
          } else {
            throw new Error(message);
          }
        });
      },
      loadHistoryData(version) {
        return docApi.getHistoryData(id, version).then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            return data;
          } else {
            throw new Error(message);
          }
        });
      },
      triggerForceSave() {
        return docApi.forceSave(id).then((res) => {
          const { data, code, message } = res;
          if (code === 200 && data) {
            return true;
          } else {
            throw new Error(message);
          }
        });
      },
      triggerKickout(userIds) {
        return docApi.kickout(id, userIds).then((res) => {
          const { code, data, message } = res;
          if (code === 200 && data) {
            return true;
          } else {
            throw new Error(message);
          }
        });
      },
      triggerKickoutOthers() {
        return docApi.kickoutOthers(id).then((res) => {
          const { code, data, message } = res;
          if (code === 200 && data) {
            return true;
          } else {
            throw new Error(message);
          }
        });
      },
      triggerKickoutAll() {
        return docApi.kickoutAll(id).then((res) => {
          const { code, data, message } = res;
          if (code === 200 && data) {
            return true;
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      triggerOnlineDocUser() {
        return docApi.getOnlineDocUser(id).then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            return data;
          } else {
            throw new Error(message);
          }
        });
      },
      triggerRestore(version) {
        return docApi.restore(id, version).then((res) => {
          const { code, message } = res;
          if (code === 200) {
            return true;
          } else {
            return Promise.reject(message);
          }
        });
      },
      triggerRename(newfilename) {
        return docApi.rename(id, { newfilename, ext: '' }).then((res) => {
          const { code, message } = res;
          if (code === 200) {
            return true;
          } else {
            throw new Error(message);
          }
        });
      },
    };
  }, [id]);

  return config == null ? (
    <div style={{ height: '100%', width: '100%' }}>
      <ToastContainer position='bottom-center' />
    </div>
  ) : (
    <OfficeEditor id={id} {...props} api={api} config={config}></OfficeEditor>
  );
};

export default DocEditor;
