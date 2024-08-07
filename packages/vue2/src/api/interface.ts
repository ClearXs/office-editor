import Result from './result';

export type Model = {
  id: string;
  /**
   * 创建时间
   */
  createdTime: Date;

  /**
   * 创建人
   */
  createdBy: string;

  /**
   * 更新时间
   */
  updatedTime: Date;

  /**
   * 更新人
   */
  updatedBy: string;

  /**
   * 逻辑删除
   */
  isDeleted: number;

  /**
   * 版本号
   */
  version: number;
};

export type IPage<T extends Model> = Partial<T> & {
  // 当前页
  current: number;
  // 页大小
  size: number;
  // 总数
  total?: number;
  // 数据
  records?: T[];
};

export type Api<T extends Model> = {
  saveOrUpdate: (model: Partial<T>) => Promise<Result<T>>;
  deleteBatchIds: (ids: string) => Promise<Result<string>>;
  details: (id: string) => Promise<Result<T>>;
  page: (pageParams: IPage<T>) => Promise<Result<IPage<T>>>;
  list: (params: Partial<T>) => Promise<Result<T[]>>;
};
