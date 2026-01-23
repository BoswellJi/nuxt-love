<template>
  <div class="text-[18px]">User Page {{ user.userInfo?.name }}</div>
  <van-button type="primary" @click="clichHanelerUserName">修改用户明</van-button>
</template>

<script setup lang="ts">
const user = useUser();
const router = useRouter();

const clichHanelerUserName = () => {
  user.userInfo.name = '修改后的用户名称';
  router.replace('/');
};
</script>
