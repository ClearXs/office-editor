type IPage<T = unknown> = {
  records: T[];
  total: number;
  size: number;
  current: number;
};

export default IPage;
