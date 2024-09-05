// stores/auth.ts

import {defineStore} from 'pinia';


export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        token: null,
        user: null,
    }),
    actions: {
        setToken(token: any) {
            this.isAuthenticated = true;
            this.token = token;
        },
        setUser(user: any) {
            this.isAuthenticated = true;
            this.user = user;
        },
        clearAuth() {
            this.isAuthenticated = false;
            this.token = null;
            this.user = null;
        },
    },
});
