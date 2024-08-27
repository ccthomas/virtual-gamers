import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const getHeader = (): { Authorization?: string } => {
  const accessToken: string | null = localStorage.getItem('accessToken');
  if (accessToken === null) {
    return {};
  }

  return { Authorization: accessToken };
};

export const apiGet = async (
  url: string,
  config?: AxiosRequestConfig<unknown> | undefined,
): Promise<AxiosResponse> => {
  const res = await axios.get(url, {
    ...config,
    headers: {
      ...config?.headers || undefined,
      ...getHeader(),
    },
  });

  return res;
};

export const apiPost = async (
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig<unknown> | undefined,
): Promise<AxiosResponse> => {
  const res = await axios.post(url, data, {
    ...config,
    headers: {
      ...config?.headers || undefined,
      ...getHeader(),
    },
  });

  return res;
};
