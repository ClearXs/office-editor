import useRequest from '../hook/request';
import { Api, IPage, Model } from './interface';
import Result from './result';

const useApi = <T extends Model>(modelPath: string): Api<T> => {
  const request = useRequest();
  return {
    saveOrUpdate(model: Partial<T>): Promise<Result<T>> {
      return request
        .post(`/api/${modelPath}/save-or-update`, model)
        .then((res: Record<string, any>) => {
          return res.data;
        });
    },
    deleteBatchIds(ids: string): Promise<Result<string>> {
      return request
        .get(`/api/${modelPath}/delete`, { ids })
        .then((res: Record<string, any>) => {
          return res.data;
        });
    },
    details(id: string): Promise<Result<T>> {
      return request
        .get(`/api/${modelPath}/details/${id}`)
        .then((res: Record<string, any>) => {
          return res.data;
        });
    },
    page(pageParams: IPage<T>): Promise<Result<IPage<T>>> {
      return request
        .post(`/api/${modelPath}/page`, { ...pageParams })
        .then((res: Record<string, any>) => {
          return res.data;
        });
    },
    list(params: Partial<T>): Promise<Result<T[]>> {
      return request
        .post(`/api/${modelPath}/list`, { ...params })
        .then((res: Record<string, any>) => {
          return res.data;
        });
    },
  };
};

export default useApi;
