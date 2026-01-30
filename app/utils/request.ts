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
      baseURL: '/api/proxy',
      method: method,
      headers: options?.headers,
      timeout: 10000,
      retry: 3,
      onRequest({ request, options }: any) {
        options.headers.token = 'test';
      },
      onRequestError({ request, options, error }) {
        const errorInfo = handleError(error, true);
        reject(errorInfo);
      },
      onResponse({ request, response }) {
        if (response.status === 200) {
          const data = response._data;
          if (data.code === '0' || data.code === 0) {
            resolve(data.data || data);
          } else {
            const message = data.message || data.msg || '操作失败';

            showToast(message);
            reject({
              code: data.code,
              message,
              data: data.data,
            });
          }
        } else {
          reject(response);
        }
      },
      onResponseError({ request, response, options }) {
        const { status, _data } = response;

        if (status === 401) {
          handleError({ statusCode: '401' }, true);
        }
        // 403 权限不足
        else if (status === 403) {
          handleError({ statusCode: '403' }, true);
        }
        // 404 资源不存在
        else if (status === 404) {
          handleError({ statusCode: '404' }, true);
        }
        // 500 服务器错误
        else if (status >= 500) {
          handleError({ statusCode: status.toString() }, true);
        }
        // 其他错误
        else {
          const message = _data?.message || _data?.msg || '请求失败';
          handleError({ statusCode: status.toString(), message }, true);
        }

        reject({
          code: _data.code,
          message: _data?.message || _data?.msg,
          data: _data.data,
        });
      },
    });
  });
}

// 错误码映射
const ERROR_MESSAGES: Record<string, string> = {
  '401': '未授权，请重新登录',
  '403': '拒绝访问',
  '404': '请求的资源不存在',
  '500': '服务器内部错误',
  '502': '网关错误',
  '503': '服务不可用',
  '504': '网关超时',
  TIMEOUT: '请求超时，请稍后重试',
  NETWORK_ERROR: '网络连接失败，请检查网络',
  ABORT: '请求已取消',
};

// 错误处理函数
function handleError(error: any, isShowToast: boolean) {
  let message = '请求失败';

  if (error.statusCode) {
    message = ERROR_MESSAGES[error.statusCode] || `请求失败 (${error.statusCode})`;
  } else if (error.name === 'AbortError') {
    message = ERROR_MESSAGES.ABORT!;
  } else if (error.message?.includes('timeout')) {
    message = ERROR_MESSAGES.TIMEOUT!;
  } else if (error.message?.includes('Network')) {
    message = ERROR_MESSAGES.NETWORK_ERROR!;
  }

  if (isShowToast) {
    showToast(message);
  }

  return { error, message };
}
