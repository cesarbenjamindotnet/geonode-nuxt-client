export default defineNuxtPlugin(async (nuxtApp) => {
    const headers = useRequestHeaders(['cookie']);
    const { status, data } = useAuth();
    const authStore = useAuthStore();

    try {
        if (status.value === 'authenticated') {
            authStore.isAuthenticated = true;

            const { data: token } = await useFetch('/api/token', { headers });

            if (token) {
                authStore.setToken(token);
                authStore.setUser(data.value.user);
                console.log("token", token);
            } else {
                throw new Error('Failed to fetch token');
            }
        }
    } catch (error) {
        console.error('Error during authentication process:', error);
    }
});