<template>
  <van-button type="primary" @click="clichHanelerAbout">按钮about</van-button>
  <van-button type="primary" @click="clichHanelerUser">按钮user</van-button>

  {{ user.userInfo?.name }}
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
</script>
