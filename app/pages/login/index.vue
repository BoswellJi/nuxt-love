<template>
  <div class="login-page">
    <h1 class="text-[red] transform text-[20px]">Login Page</h1>
    <el-button type="primary" @click="loginHandle">Login</el-button>
  </div>
</template>
<script setup lang="ts">
const loginHandle = async () => {
  const res = await $fetch('/api/user/add?id=1', {
    method: 'POST',
    body: {
      name: 'New User',
    },
  });
  console.log('User added:', res);
};
</script>
<style scoped>
.login-page {
  padding: 20px;
}
</style>
