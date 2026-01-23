export const useUser = defineStore('userStore', () => {
  const userInfo = reactive({
    name: 'John Doe',
    email: '',
  });

  return {
    userInfo,
  };
});
