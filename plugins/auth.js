
export default defineNuxtPlugin(async (nuxtApp) => {
    const headers = useRequestHeaders(['cookie']);
    const {status, data} = useAuth();
    const authStore = useAuthStore();

    try {
        if (status?.value === 'authenticated') {
            authStore.isAuthenticated = true;
            const {data: token} = await useFetch('/api/token', {headers});
            console.log('Token:', token.value);

            if (token) {
                authStore.setToken(token.value);
                authStore.setUser(data.value.user);
            } else {
                authStore.clearAuth();
            }
        }
    } catch (error) {
        console.error('Error during authentication process:', error);
    }
});
