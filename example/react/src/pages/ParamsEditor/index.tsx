import { useParams } from '@umijs/max';
import Editor from '../Editor';

const ParamsEditor = () => {
  const params = useParams<{ docId: string }>();
  return params.docId && <Editor docId={params.docId}></Editor>;
};

export default ParamsEditor;
