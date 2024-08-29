// stores/auth.ts

import {defineStore} from 'pinia';

const GEONODE_PROFILE_URL = `${process.env.GEONODE_BASE_URL}/api/v2/users`;

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        token: null,
        user: null,
    }),
    actions: {
        setToken(token: any) {
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
        async fetchUserProfile(id: string, access_token: any): Promise<any> {
            try {
                const userProfileData = await $fetch(`${GEONODE_PROFILE_URL}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                });
                if (!!userProfileData && userProfileData.user) {
                    return userProfileData.user;
                } else {
                    throw new Error('No user profile data');
                }
            } catch (error) {
                console.error(`Error fetching user profile from ${url}`, error);
                return null;
            }
        },
        async setUserProfile(id: string) {
            if (!this.token) return;

            try {
                const userProfileData = await $fetch(
                    `${process.env.GEONODE_API_URL}/v2/users/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${this.token.access_token}`,
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
