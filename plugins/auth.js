export default defineNuxtPlugin(async (nuxtApp) => {
    const headers = useRequestHeaders(['cookie']);
    const {status, data} = useAuth();

    const authStore = useAuthStore();

    if (status.value === 'authenticated') {
        authStore.isAuthenticated = true;
        console.log("authenticated");
        console.log("headers", headers);
        console.log("status", status);
        console.log("data", data.value.user);
        const {data: token} = await useFetch('/api/token', {headers})

        authStore.setToken(token);
        authStore.setUser(data.value.user);
        console.log("token", token);

    }
});
