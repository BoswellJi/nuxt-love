import { kv } from '@nuxthub/kv';

export default defineEventHandler(async (event) => {
  const vue = await kv.get('vue');

  return {
    success: true,
    data: vue,
  };
});
