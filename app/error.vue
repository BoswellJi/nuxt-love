<script setup lang="ts">
interface ErrorInfo {
  status?: number;
  statusMessage?: string;
  message?: string;
  data?: {
    code?: string;
  };
}

const props = defineProps<{
  error?: ErrorInfo;
}>();

const handleError = () => clearError({ redirect: '/' });
const handleRefresh = () => window.location.reload();

// 根据状态码获取对应的错误信息
const errorConfig = computed(() => {
  const status = props.error?.status || 500;
  const configs: Record<number, { title: string; description: string; icon: string }> = {
    400: {
      title: '请求错误',
      description: '您的请求格式不正确，请检查后重试。',
      icon: 'warning',
    },
    401: {
      title: '未授权访问',
      description: '您需要登录才能访问此页面。',
      icon: 'lock',
    },
    403: {
      title: '禁止访问',
      description: '您没有权限访问此资源。',
      icon: 'shield',
    },
    404: {
      title: '页面未找到',
      description: '抱歉，您访问的页面不存在或已被移除。',
      icon: 'search',
    },
    500: {
      title: '服务器错误',
      description: '服务器出现了一些问题，我们正在努力修复。',
      icon: 'server',
    },
    502: {
      title: '网关错误',
      description: '服务器网关出现问题，请稍后重试。',
      icon: 'cloud',
    },
    503: {
      title: '服务不可用',
      description: '服务暂时不可用，请稍后再试。',
      icon: 'maintenance',
    },
  };
  return (
    configs[status] || {
      title: '出错了',
      description: '发生了意外错误，请稍后重试。',
      icon: 'error',
    }
  );
});
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-slate-900 dark:to-indigo-950 p-4 overflow-hidden relative"
  >
    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-purple-300/30 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300/30 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse"
        style="animation-delay: 1s"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-200/20 dark:bg-indigo-800/10 rounded-full blur-3xl"
      ></div>
    </div>

    <!-- 主内容卡片 -->
    <div
      class="relative max-w-lg w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-500/10 dark:shadow-black/30 p-8 md:p-12 text-center border border-white/50 dark:border-gray-700/50 animate-fade-in"
    >
      <!-- 错误图标 -->
      <div class="mb-6 flex justify-center">
        <div
          class="w-24 h-24 rounded-full bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 flex items-center justify-center animate-bounce-slow"
        >
          <!-- 404 图标 -->
          <svg
            v-if="props.error?.status === 404"
            class="w-12 h-12 text-red-500 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
            />
          </svg>
          <!-- 500 图标 -->
          <svg
            v-else-if="props.error?.status === 500"
            class="w-12 h-12 text-red-500 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
            />
          </svg>
          <!-- 401/403 图标 -->
          <svg
            v-else-if="props.error?.status === 401 || props.error?.status === 403"
            class="w-12 h-12 text-red-500 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <!-- 默认图标 -->
          <svg
            v-else
            class="w-12 h-12 text-red-500 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      </div>

      <!-- 错误状态码 -->
      <div class="mb-4">
        <span
          class="text-8xl md:text-9xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 dark:from-red-400 dark:via-orange-400 dark:to-amber-400 tracking-tight"
        >
          {{ props.error?.status || '错误' }}
        </span>
      </div>

      <!-- 错误标题 -->
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3 tracking-tight">
        {{ props.error?.statusMessage || errorConfig.title }}
      </h1>

      <!-- 错误描述 -->
      <p class="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-sm mx-auto">
        {{ props.error?.message || errorConfig.description }}
      </p>

      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <!-- 返回首页按钮 -->
        <button
          class="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-0.5"
          @click="handleError"
        >
          <svg
            class="w-5 h-5 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          返回首页
        </button>

        <!-- 刷新页面按钮 -->
        <button
          class="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
          @click="handleRefresh"
        >
          <svg
            class="w-5 h-5 transition-transform group-hover:rotate-180 duration-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          刷新页面
        </button>
      </div>

      <!-- 错误详情（开发模式可见） -->
      <div
        v-if="props.error?.data?.code"
        class="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50"
      >
        <div
          class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100/80 dark:bg-gray-800/80 rounded-full"
        >
          <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span class="text-sm text-gray-500 dark:text-gray-400 font-mono">
            错误代码: {{ props.error?.data?.code }}
          </span>
        </div>
      </div>
    </div>

    <!-- 底部装饰文字 -->
    <p class="mt-8 text-sm text-gray-400 dark:text-gray-600 relative">如有问题，请联系技术支持</p>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce-slow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-bounce-slow {
  animation: bounce-slow 3s ease-in-out infinite;
}
</style>
