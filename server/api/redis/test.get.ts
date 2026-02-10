import { kv } from '@nuxthub/kv';

export default defineEventHandler(async (event) => {
  await kv.set('vue', { year: 2014 });

  return {
    success: true,
    data: 'Redis test endpoint is working!',
  };
});
