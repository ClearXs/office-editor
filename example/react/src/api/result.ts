type Result<T> = {
  code: number;
  message: string;
  data: T;
};

export default Result;
