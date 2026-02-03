<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useSlots } from 'vue';

const emits = defineEmits<{
  (e: 'callback', data: { response: string; type: string }): void;
}>();

const slot = useSlots();
const id = ref('');

const init = () => {
  const script = document.createElement('script');
  script.src = 'https://jy.17u.cn/recaptcha/api.js?project_id=www_lvcang_cn';
  document.body.appendChild(script);

  const el = document.createElement('div');
  el.setAttribute('data-bind', id.value);
  el.setAttribute('data-callback', 'onSuccess');
  el.setAttribute('id', 'www_lvcang_cn');
  el.setAttribute('data-qq_tag', 'sdk');
  document.body.appendChild(el);

  window.onSuccess = async (response: string, type: string) => {
    emits('callback', { response: response, type });
  };
};

onMounted(() => {
  id.value = slot.default?.()[0]?.el?.id;
  if (id.value) {
    init();
  } else {
    throw new Error('Recaptcha 组件需要有唯一的子元素作为触发容器，请检查代码。');
  }
});
</script>
