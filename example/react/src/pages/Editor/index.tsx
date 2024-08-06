import { OfficeEditor } from '@office-editor/react';
import { useParams } from '@umijs/max';
import { useEffect } from 'react';

const Editor = () => {
  const params = useParams<{ docId: string }>();

  useEffect(() => {}, [params.docId]);

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <OfficeEditor
        docId={params.docId as string}
        printLog={true}
        onDocumentBeforeDestroy={() => {
          console.log(this);
        }}
      />
    </div>
  );
};

export default Editor;
