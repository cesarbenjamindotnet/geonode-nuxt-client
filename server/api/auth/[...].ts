import {NuxtAuthHandler} from '#auth';
import {OAuthConfig} from '@auth/core/providers';

// Configuración de constantes
const GEONODE_API_URL = process.env.GEONODE_BASEURL || '';
const WELL_KNOWN_URL = `${process.env.GEONODE_ISSUER}/.well-known/openid-configuration/`;

async function fetchUserProfile(url: string, token: string) {
    try {
        const userProfileData = await $fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return userProfileData?.user;
    } catch (error) {
        console.error(`Error fetching user profile from ${url}`, error);
        return null;
    }
}

export default NuxtAuthHandler({
    secret: useRuntimeConfig().authSecret || process.env.NEXTAUTH_SECRET,

    providers: [
        {
            id: 'geonode',
            name: 'GeoNode',
            type: 'oauth',
            issuer: process.env.GEONODE_ISSUER,
            wellKnown: WELL_KNOWN_URL,
            clientId: process.env.GEONODE_CLIENT_ID || '',
            clientSecret: process.env.GEONODE_CLIENT_SECRET || '',
            authorization: {
                params: {scope: 'openid read write groups profile'},
            },
            async profile(profile: any, token: any) {
                const url = `${GEONODE_API_URL}/api/v2/users/${profile.sub}`;
                const fetchedProfile = await fetchUserProfile(url, token.access_token);

                if (fetchedProfile) {
                    profile = fetchedProfile;
                    profile.id = profile.pk;
                    console.log('Profile', profile);
                }

                return profile;
            },
        } as OAuthConfig,
    ],

    callbacks: {
        async session({session, token}) {
            session.user = {
                ...session.user,
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
                id: token.sub,
                profile: token.profile,
            }
            return session;
        },

        async jwt({token, account}) {
            if (account) {
                token = {
                    ...token,
                    id: account.sub,
                    tokenType: account.token_type,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    idToken: account.id_token,
                };

                const url = `${GEONODE_API_URL}/api/v2/users/${account.providerAccountId}`;
                const fetchedProfile = await fetchUserProfile(url, account.access_token || "");

                if (fetchedProfile) {
                    token.profile = fetchedProfile;
                }
            }
            return token;
        },
    },
});
