import useRequest from '@/hook/request';
import Result from './result';

const useFileApi = () => {
  const request = useRequest();
  const upload = (file: any): Promise<Result<any>> => {
    return request
      .post(
        '/api/sys/attachment/upload',
        { file },
        { 'Content-Type': 'multipart/form-data' },
      )
      .then((res) => {
        return res.data;
      });
  };

  return { upload };
};

export default useFileApi;
