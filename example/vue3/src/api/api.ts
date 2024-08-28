import useRequest from './request';
import {
  type Api,
  type GeneralParams,
  type IPage,
  type Model,
  type RemoteQueryParam,
  type Term,
} from './interface';
import { type Result } from './result';

const useApi = <T extends Model>(modelPath: string): Api<T> => {
  const request = useRequest();
  const buildRemoteQueryParam = <T extends Model>(
    general?: GeneralParams<T>
  ): RemoteQueryParam => {
    const terms: Term[] = [];
    const entity = general?.entity;
    if (entity) {
      for (const key in entity) {
        const value = entity[key];
        if (value) {
          terms.push({ field: key, value });
        }
      }
    }
    return { terms };
  };
  return {
    saveOrUpdate(model: Partial<T>): Promise<Result<T>> {
      return request
        .post(`/api${modelPath}/save-or-update`, model)
        .then((res: Record<string, any>) => {
          return res.data;
        });
    },
    deleteBatchIds(ids: string): Promise<Result<string>> {
      return request
        .get(`/api${modelPath}/delete`, { ids })
        .then((res: Record<string, any>) => {
          return res.data;
        });
    },
    details(id: string): Promise<Result<T>> {
      return request
        .get(`/api${modelPath}/details/${id}`)
        .then((res: Record<string, any>) => {
          return res.data;
        });
    },
    page(page: IPage<T>, params?: GeneralParams<T>): Promise<Result<IPage<T>>> {
      const queryParam = buildRemoteQueryParam(params);
      return request
        .post(`/api${modelPath}/page`, { page, ...queryParam })
        .then((res: Record<string, any>) => {
          return res.data;
        });
    },
    list(params: Partial<T>): Promise<Result<T[]>> {
      return request
        .post(`/api${modelPath}/list`, { ...params })
        .then((res: Record<string, any>) => {
          return res.data;
        });
    },
  };
};

export default useApi;
