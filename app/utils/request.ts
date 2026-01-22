export function $fetchSelf<T>(
  url: string,
  method: 'get' | 'post',
  options?: { headers?: Record<string, any>; data?: Record<string, any> },
): Promise<T> {
  const optionsSelf = {
    body: undefined as Record<string, any> | undefined,
    query: undefined as Record<string, any> | undefined,
  };

  if (method === 'post') {
    optionsSelf.body = options?.data;
  } else if (method === 'get') {
    optionsSelf.query = options?.data;
  }

  return new Promise((resolve, reject) => {
    $fetch(url, {
      ...optionsSelf,
      method: method,
      headers: options?.headers,
      timeout: 100,
      retry: 3,
      onRequest({ request, options }: any) {
        options.headers.token = 'test';
      },
      onRequestError({ request, options, error }) {
        console.error(error);
      },
      onResponse({ request, response }) {
        if (response.status === 200) {
          const data = response._data;
          if (data.code === '0') {
            resolve(response._data);
          } else {
            reject(response);
          }
        }
      },
      onResponseError({ request, response, options }) {
        console.error('Response Error:', request, response, options);
      },
    });
  });
}
