// stores/auth.ts

import {defineStore} from 'pinia';


export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        token: null as null | any,
        user: null as null | any,
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
            // TODO: implementar que se use esta función para cerrar sesión
            this.isAuthenticated = false;
            this.token = null;
            this.user = null;
        },
    },
});
