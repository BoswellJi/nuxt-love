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

const errorConfig = computed(() => {
  const status = props.error?.status || 500;
  const configs: Record<number, { title: string; description: string }> = {
    400: { title: '请求错误', description: '请检查输入后再试。' },
    401: { title: '未授权访问', description: '登录后即可继续访问。' },
    403: { title: '禁止访问', description: '您暂时没有权限。' },
    404: { title: '页面未找到', description: '检查网址或返回首页。' },
    500: { title: '服务器错误', description: '我们正在修复服务器问题。' },
    502: { title: '网关响应异常', description: '稍后重试即可。' },
    503: { title: '服务暂不可用', description: '稍后再回来看看吧。' },
  };
  return configs[status] || { title: '出错了', description: '意外错误，请稍后再试。' };
});
</script>

<template>
  <div class="mobile-error-page">
    <div class="atmosphere"></div>
    <div class="card">
      <div class="status-chip">
        <span>{{ props.error?.status || 500 }}</span>
      </div>
      <h1>{{ props.error?.statusMessage || errorConfig.title }}</h1>
      <p class="subtitle">{{ props.error?.message || errorConfig.description }}</p>
      <div class="cta-group">
        <button class="primary" @click="handleError">返回首页</button>
        <button class="ghost" @click="handleRefresh">刷新页面</button>
      </div>
      <p v-if="props.error?.data?.code" class="detail">错误代码：{{ props.error?.data?.code }}</p>
    </div>
    <footer>
      <span>如需帮助，可联系客服</span>
    </footer>
  </div>
</template>

<style scoped>
:global(body) {
  min-height: 100vh;
}

.mobile-error-page {
  min-height: 100vh;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  background:
    radial-gradient(circle at top, rgba(59, 130, 246, 0.15), transparent 40%),
    linear-gradient(180deg, #0f172a, #020617 60%);
  color: #f8fafc;
  position: relative;
  overflow: hidden;
}

.atmosphere {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.25), transparent 45%),
    radial-gradient(circle at 80% 0%, rgba(248, 113, 113, 0.4), transparent 40%);
  filter: blur(15px);
  pointer-events: none;
}

.card {
  position: relative;
  z-index: 1;
  background: rgba(2, 6, 23, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 25px 35px rgba(15, 23, 42, 0.8);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
}

.status-chip {
  align-self: center;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.18);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(59, 130, 246, 0.4);
}

.status-chip span {
  font-weight: 700;
  letter-spacing: 0.2rem;
  color: #93c5fd;
}

.card h1 {
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  margin: 0;
}

.subtitle {
  color: #e2e8f0;
  margin: 0;
  line-height: 1.5;
  font-size: 1rem;
}

.cta-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.cta-group button {
  border: none;
  border-radius: 999px;
  font-weight: 600;
  padding: 0.85rem 1.4rem;
  font-size: 1rem;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.cta-group button:active {
  transform: translateY(1px);
}

.cta-group button.primary {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: #fff;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.4);
}

.cta-group button.ghost {
  background: transparent;
  border: 1px solid rgba(148, 163, 184, 0.6);
  color: #cbd5f5;
}

.detail {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-top: 0.5rem;
}

footer {
  position: relative;
  z-index: 1;
  margin-top: 2rem;
  text-align: center;
  font-size: 0.9rem;
  color: rgba(148, 163, 184, 0.9);
}

@media (min-width: 768px) {
  .mobile-error-page {
    align-items: center;
    padding: 3rem;
  }

  .card {
    max-width: 420px;
  }

  .cta-group {
    flex-direction: row;
  }

  .cta-group button {
    flex: 1;
  }
}
</style>
