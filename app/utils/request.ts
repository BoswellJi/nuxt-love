// API 响应类型定义
interface ApiResponse<T = any> {
  code: string | number;
  data: T;
  message?: string;
  msg?: string;
}

// 请求配置选项
export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  showError?: boolean;
  showSuccessMsg?: boolean;
}

/**
 * Nuxt 推荐的请求封装
 * 使用 $fetch 进行客户端请求，支持自动错误处理和拦截器
 */
export function useRequest<T = any>(
  url: string,
  options?: RequestOptions & { method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' },
  baseURL?: string,
) {
  const {
    method = 'GET',
    headers = {},
    params,
    showError = true,
    showSuccessMsg = false,
    ...otherOptions
  } = options || {};

  return $fetch<T>(url, {
    baseURL: baseURL || '/',
    method,
    headers: {
      ...headers,
    },
    query: method === 'GET' ? params : undefined,
    body: method !== 'GET' ? params : undefined,
    timeout: 10000,
    retry: 3,

    onRequest({ options }) {
      // 添加认证 token
      const token = getToken();
      if (token) {
        options.headers = {
          ...options.headers,
          token,
        } as any;
      }
    },

    onResponse({ response }) {
      const data = response._data as ApiResponse<T>;

      // 业务成功
      if (data.code === '0' || data.code === 0) {
        if (showSuccessMsg && data.message) {
          showToast(data.message);
        }
        // 返回实际数据
        response._data = data.data;
      } else {
        // 业务失败
        const message = data.message || data.msg || '操作失败';
        if (showError) {
          showToast(message);
        }
        throw createError({
          statusCode: 400,
          statusMessage: message,
          data,
        });
      }
    },

    onResponseError({ response }) {
      const { status, _data } = response;

      // HTTP 错误处理
      const errorHandlers: Record<number, () => void> = {
        401: () => handleError({ statusCode: '401' }, showError),
        403: () => handleError({ statusCode: '403' }, showError),
        404: () => handleError({ statusCode: '404' }, showError),
      };

      if (errorHandlers[status]) {
        errorHandlers[status]();
      } else if (status >= 500) {
        handleError({ statusCode: status.toString() }, showError);
      } else {
        const message = _data?.message || _data?.msg || '请求失败';
        handleError({ statusCode: status.toString(), message }, showError);
      }
    },

    onRequestError({ error }) {
      handleError(error, showError);
    },

    ...otherOptions,
  });
}

/**
 * GET 请求
 */
export function proxyGet<T = any>(url: string, options?: RequestOptions) {
  return useRequest<T>(url, { ...options, method: 'GET' }, '/api/proxy');
}

/**
 * POST 请求
 */
export function proxyPost<T = any>(
  url: string,
  params?: Record<string, any>,
  options?: RequestOptions,
) {
  return useRequest<T>(url, { ...options, params, method: 'POST' }, '/api/proxy');
}

/**
 * PUT 请求
 */
export function get<T = any>(url: string, params?: Record<string, any>, options?: RequestOptions) {
  return useRequest<T>(url, { ...options, params, method: 'GET' });
}

/**
 * DELETE 请求
 */
export function post<T = any>(url: string, params?: Record<string, any>, options?: RequestOptions) {
  return useRequest<T>(url, { ...options, params, method: 'POST' });
}

/**
 * 获取 Token（根据实际项目调整）
 */
function getToken(): string {
  if (import.meta.client) {
    // 客户端从 localStorage 获取
    return localStorage.getItem('token') || '';
  }
  return '';
}

/**
 * 兼容旧的 API（向后兼容）
 * @deprecated 建议使用新的 useRequest、get、post 等方法
 */
export function $fetchSelf<T>(
  url: string,
  method: 'get' | 'post',
  options?: { headers?: Record<string, any>; data?: Record<string, any> },
): Promise<T> {
  return useRequest<T>(url, {
    method: method.toUpperCase() as any,
    headers: options?.headers,
    params: options?.data,
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

/**
 * 统一错误处理函数
 */
function handleError(error: any, showError: boolean) {
  let message = '请求失败';

  if (error.statusCode) {
    message = ERROR_MESSAGES[error.statusCode] || `请求失败 (${error.statusCode})`;

    if (error.statusCode === '401' && import.meta.client) {
      // 可以使用 navigateTo 或其他路由跳转方式
      // navigateTo('/login')
    }
  } else if (error.name === 'AbortError') {
    message = ERROR_MESSAGES.ABORT || '请求已取消';
  } else if (error.message?.includes('timeout')) {
    message = ERROR_MESSAGES.TIMEOUT || '请求超时';
  } else if (error.message?.includes('Network') || error.message?.includes('fetch failed')) {
    message = ERROR_MESSAGES.NETWORK_ERROR || '网络错误';
  } else if (error.message) {
    message = error.message;
  }

  if (showError) {
    showToast(message);
  }

  return { error, message };
}

/**
 * 显示提示消息
 * 需要根据实际使用的 UI 库进行调整
 * 例如：Element Plus, Ant Design Vue, Naive UI 等
 */
function showToast(message: string) {
  if (import.meta.client) {
    // 示例：使用浏览器原生 alert（建议替换为实际的 Toast 组件）
    // 如果使用了 UI 库，替换为相应的方法，例如：
    // ElMessage.error(message) // Element Plus
    // message.error(message)   // Ant Design Vue
    // window.$message.error(message) // Naive UI
    console.error('[Toast]:', message);
  }
}
