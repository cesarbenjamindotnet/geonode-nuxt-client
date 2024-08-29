export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();

    /*
    if (!authStore.isAuthenticated && to.name !== 'login') {
      return navigateTo('/login');
    }
    */
    if (authStore.isAuthenticated ) {
        console.log('authStore.isAuthenticated is true');
    } else {
        console.log('authStore.isAuthenticated is false');
    }
});
