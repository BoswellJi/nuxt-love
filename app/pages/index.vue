<template>
  <div class="text-center">
    <h1 class="text-[18px]">路由</h1>
    <div>
      <van-button type="primary" @click="clichHanelerAbout">/about</van-button>
      <van-button type="primary" @click="clichHanelerUser">/user</van-button>
    </div>
    <br />

    <h1 class="text-[18px]">状态管理</h1>
    <div class="text-[18px]">{{ user.userInfo?.name }}</div>
    <br />

    <h1 class="text-[18px]">验证码组件</h1>
    <recaptcha @callback="onRecaptchaCallback">
      <div id="login">发送短信</div>
    </recaptcha>
    {{ recaptchaVal?.response }} {{ recaptchaVal?.type }}
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const user = useUser();

const clichHanelerAbout = () => {
  router.push('/about');
};

const clichHanelerUser = () => {
  router.push('/user');
};

const recaptchaVal = ref<{ response: string; type: string } | null>();
const onRecaptchaCallback = (data: { response: string; type: string }) => {
  recaptchaVal.value = data;
};
</script>
