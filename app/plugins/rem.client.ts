// 移动端 rem 适配插件
export default defineNuxtPlugin(() => {
  const designWidth = 375; // 设计稿宽度
  const baseFontSize = 100; // 基准字体大小，对应 postcss-pxtorem 的 rootValue

  const setRem = () => {
    const clientWidth = document.documentElement.clientWidth;
    // 限制最大宽度，避免在大屏上字体过大
    const width = Math.min(clientWidth, 750);
    const fontSize = (width / designWidth) * baseFontSize;
    document.documentElement.style.fontSize = `${fontSize}px`;
  };

  // 初始化
  setRem();

  // 监听窗口变化
  window.addEventListener('resize', setRem);
  window.addEventListener('orientationchange', setRem);
});
