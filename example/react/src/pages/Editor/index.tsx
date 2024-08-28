import useDocApi from '@/api/doc';
import { useEditorApi } from '@/api/editor';
import {
  DocumentEditorConfig,
  IEditor,
  IEditorApi,
  OfficeEditor,
} from '@office-editor/react';
import { Button, message } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';

export type IEditorProps = {
  docId: string;
};

const Editor: React.FC<IEditorProps> = ({ docId }) => {
  const [messageApi, messageContextHolder] = message.useMessage();
  const docApi = useDocApi();
  const editorApi = useEditorApi();

  const [config, setConfig] = useState<DocumentEditorConfig>();

  const editorRef = useRef<IEditor>();

  useEffect(() => {
    editorApi.editor(docId).then((res) => {
      const { code, data, message } = res;
      if (code === 200) {
        setConfig(data);
      } else {
        messageApi.error(message);
      }
    });
  }, [docId]);

  const internalApi: IEditorApi = useMemo(() => {
    return {
      loadHistoryList() {
        return docApi.getHistory(docId).then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            return Promise.resolve(data);
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      loadHistoryData(version) {
        docApi.getHistoryData(docId, version).then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            return Promise.resolve(data);
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      triggerForceSave() {
        return docApi.forceSave(docId).then((res) => {
          const { data, code, message } = res;
          if (code === 200 && data) {
            return Promise.resolve(true);
          } else {
            return Promise.reject(message);
          }
        });
      },
      triggerKickout(userIds) {
        return docApi.kickout(docId, userIds).then((res) => {
          const { code, data, message } = res;
          if (code === 200 && data) {
            return Promise.resolve(true);
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      triggerKickoutOthers() {
        return docApi.kickoutOthers(docId).then((res) => {
          const { code, data, message } = res;
          if (code === 200 && data) {
            return Promise.resolve(true);
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      triggerKickoutAll() {
        return docApi.kickoutAll(docId).then((res) => {
          const { code, data, message } = res;
          if (code === 200 && data) {
            return Promise.resolve(true);
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      triggerOnlineDocUser() {
        return docApi.getOnlineDocUser(docId).then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            return Promise.resolve(data);
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      triggerRestore(version) {
        return docApi.restore(docId, version).then((res) => {
          const { code, message } = res;
          if (code === 200) {
            return Promise.resolve(true);
          } else {
            return Promise.reject(message);
          }
        });
      },
      triggerRename(newfilename) {
        return docApi.rename(docId, { newfilename }).then((res) => {
          const { code, message } = res;
          if (code === 200) {
            return Promise.resolve(true);
          } else {
            return Promise.reject(message);
          }
        });
      },
    };
  }, [docId]);

  return (
    <>
      {messageContextHolder}
      {config && (
        <div style={{ height: '100vh', width: '100vw' }}>
          <OfficeEditor
            id={docId}
            config={config}
            api={internalApi}
            printLog={true}
            onDocumentReady={(editor) => {
              editorRef.current = editor;
            }}
            onDocumentBeforeDestroy={() => {
              console.log(this);
            }}
          />

          <div
            style={{ display: 'flex', position: 'absolute', top: 0, gap: 10 }}
          >
            <Button onClick={() => editorRef.current?.triggerKickout?.(['1'])}>
              踢出
            </Button>
            <Button onClick={() => editorRef.current?.triggerKickoutAll?.()}>
              踢出所有人
            </Button>
            <Button onClick={() => editorRef.current?.triggerKickoutOthers?.()}>
              踢出其他人
            </Button>
            <Button onClick={() => editorRef.current?.triggerForceSave?.()}>
              强制保存
            </Button>
            <Button
              onClick={() =>
                editorRef.current?.onlineDocUser?.((users) => {
                  message.info(JSON.stringify(users));
                })
              }
            >
              在线用户
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Editor;
