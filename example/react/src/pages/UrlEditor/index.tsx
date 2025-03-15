import { DocEditor, IEditor } from '@clearx/office-editor-react';
import { useParams } from '@umijs/max';
import { Button, message } from 'antd';
import { useRef } from 'react';

const UrlEditor: React.FC = ({}) => {
  const params = useParams<{ docId: string }>();
  const editorRef = useRef<IEditor>();

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <DocEditor
        id={params.docId!}
        docUrl="/office-api"
        user={{ userId: '1', username: 'zhangsan' }}
        cipher="allio"
        printLog={true}
        onDocumentReady={(editor) => {
          editorRef.current = editor;
        }}
        onDocumentBeforeDestroy={() => {
          console.log(this);
        }}
      />

      <div style={{ display: 'flex', position: 'absolute', top: 0, gap: 10 }}>
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
  );
};

export default UrlEditor;
