<template>
  <div>Hello World</div>
  <van-button type="primary" @click="clichHaneler">按钮</van-button>
</template>

<script setup lang="ts">
const clichHaneler = async () => {
  const todo = await $fetchSelf(
    '/api/proxy/memberbenefit/cooperator/qiumo/benefit/productInfo',
    'get',
    {
      headers: {
        'Content-Type': 'application/json',
        appKey: 'benefit.activity',
        appSecret: 'c86d96ecc17b86e4',
      },
      data: {
        benefitNo: 'NO176423180973320B8A',
      },
    },
  );
  console.log('todo', todo);
};
</script>
