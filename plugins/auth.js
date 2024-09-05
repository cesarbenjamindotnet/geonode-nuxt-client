export default defineNuxtPlugin(async (nuxtApp) => {
    const headers = useRequestHeaders(['cookie']);
    const {status, data} = useAuth();
    const authStore = useAuthStore();

    try {
        if (status?.value === 'authenticated') {
            console.log('(plugin auth) is Authenticated:', status.value);

            authStore.isAuthenticated = true;

            const {data: token} = await useFetch('/api/token', {headers});

            if (token) {
                authStore.setToken(token);
                authStore.setUser(data.value.user);
            } else {
                throw new Error('Token is undefined');
            }
        }
    } catch (error) {
        console.error('Error during authentication process:', error);
    }
});

