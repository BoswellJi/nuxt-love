export default defineNuxtRouteMiddleware(() => {
  const token = useCookie<string | null>('token').value;
  const isLoggedIn = Boolean(token);

  if (!isLoggedIn) {
    return navigateTo('/', { redirectCode: 301 });
  }
});
