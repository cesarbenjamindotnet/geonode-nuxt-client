import {NuxtAuthHandler} from '#auth';

// Configuración de constantes
const GEONODE_BASE_URL = process.env.NUXT_GEONODE_BASE_URL || '';
const GEONODE_WELL_KNOWN_URL = `${process.env.NUXT_GEONODE_ISSUER}/.well-known/openid-configuration/`;
const GEONODE_APIV2_USERS_URL = `${GEONODE_BASE_URL}/api/v2/users`;

// Función para obtener el perfil del usuario
async function fetchUserData(url: string, token: string) {
    try {
        const userData = await $fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (userData) {
            return userData;
        } else {
            throw new Error('No user data');
        }
    } catch (error) {
        console.error(`Error fetching user data from ${url}`, error);
        return null;
    }
}

// Verificación de variables de entorno
if (!process.env.NUXT_GEONODE_ISSUER || !process.env.NUXT_GEONODE_CLIENT_ID || !process.env.NUXT_GEONODE_CLIENT_SECRET) {
    throw new Error('Missing required environment variables for GeoNode authentication');
}

export default NuxtAuthHandler({
    secret: useRuntimeConfig().authSecret || process.env.NEXTAUTH_SECRET,

    providers: [
        {
            id: 'geonode',
            name: 'GeoNode',
            type: 'oauth',
            issuer: process.env.NUXT_GEONODE_ISSUER,
            wellKnown: GEONODE_WELL_KNOWN_URL,
            clientId: process.env.NUXT_GEONODE_CLIENT_ID || '',
            clientSecret: process.env.NUXT_GEONODE_CLIENT_SECRET || '',
            authorization: {
                params: {
                    scope: 'openid read write',
                },
            },

            async profile(profile: any, token: any) {
                const fetchedUserData = await fetchUserData(`${GEONODE_APIV2_USERS_URL}/${profile.sub}`, token.access_token);
                if (fetchedUserData && fetchedUserData.user) {
                    profile = fetchedUserData.user;
                    profile.id = profile.pk;
                }
                return profile;
            },
        },
    ],

    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token = {
                    ...token,
                    id: account.providerAccountId,
                    provider: account.provider,
                    scope: account.scope,
                    token_type: account.token_type,
                    access_token: account.access_token,
                    refresh_token: account.refresh_token,
                    id_token: account.id_token,
                    test: "jwt test",
                };

                const fetchedUserData = await fetchUserData(`${GEONODE_APIV2_USERS_URL}/${account.providerAccountId}`, account.access_token || '');

                if (fetchedUserData && fetchedUserData.user) {
                    // console.log("fetchedUserData.user", fetchedUserData.user);
                    token.user = fetchedUserData.user;
                    token.picture = fetchedUserData.user.avatar;
                    token.name = (fetchedUserData.user.first_name + ' ' + fetchedUserData.user.last_name).trim();
                }
                console.log("token", token);
            }
            return token;
        },
    },
});