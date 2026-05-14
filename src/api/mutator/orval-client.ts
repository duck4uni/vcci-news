const useCustomClient = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    method: options?.method || "GET",
    headers: options?.headers,
    body: options?.body,
    signal: options?.signal,
  });

  const data = await response.json();
  return { ...data, statusCode: response.status };
};

export { useCustomClient };

export type ErrorType<Error> = Error;
export type BodyType<BodyData> = BodyData;