export type RequestInitType = RequestInit & {
  url: string;
  params?: Record<string | number, any>;
  data?: Record<string | number, any>;
  showError?: boolean;
  getResponse?: (res: Response) => void; // 获取原始response
};

export type GetInit = Omit<RequestInitType, 'data'>;
