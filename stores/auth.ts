// stores/auth.ts

import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: null,
        user: null,
    }),
    actions: {
        setToken(token: any) {
            this.token = token;
        },
        setUser(user: any) {
            this.user = user;
        },
        clearAuth() {
            this.token = null;
            this.user = null;
        },
        async fetchUserProfile() {
            if (!this.token) return;

            try {
                const userProfileData = await $fetch(
                    `${process.env.GEONODE_BASEURL}/api/v2/users/${this.user.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${this.token.accessToken}`,
                        },
                    }
                );
                this.setUser(userProfileData?.user);
            } catch (error) {
                console.error('Error fetching user profile', error);
            }
        },
    },
});
