import {NuxtAuthHandler} from '#auth';

// Configuración de constantes
const GEONODE_BASEURL = process.env.NUXT_GEONODE_BASEURL || '';
const GEONODE_WELL_KNOWN_URL = `${process.env.NUXT_GEONODE_ISSUER}/.well-known/openid-configuration/`;
const GEONODE_APIV2_USERS_URL = `${GEONODE_BASEURL}/api/v2/users`;

interface RefreshToken {
    access_token: string;
    expires_in: number;
    token_type: string;
    scope: string;
    refresh_token: string;
}

interface GeoNodeUser {
    pk: number;
    username: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
    perms: string[];
    is_superuser: boolean;
    is_staff: boolean;
    email: string;
    link: string;
}

interface UserData {
    user: GeoNodeUser;
}

// Función para refrescar el token de acceso
async function refreshAccessToken(token: any) {
    try {
        // const url = `${process.env.NUXT_GEONODE_ISSUER}/token/?client_id=${process.env.NUXT_GEONODE_CLIENT_ID}&client_secret=${process.env.NUXT_GEONODE_CLIENT_SECRET}&refresh_token=${token.refresh_token}&grant_type=refresh_token`;
        // const url = `${process.env.NUXT_GEONODE_ISSUER}/token/?client_id=${process.env.NUXT_GEONODE_CLIENT_ID}&client_secret=${process.env.NUXT_GEONODE_CLIENT_SECRET}&refresh_token=${token.refresh_token}&grant_type=refresh_token`;

        const refreshedToken = await $fetch<RefreshToken>(`${process.env.NUXT_GEONODE_ISSUER}/token/`, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
            body: new URLSearchParams({
                client_id: process.env.NUXT_GEONODE_CLIENT_ID || "",
                client_secret: process.env.NUXT_GEONODE_CLIENT_SECRET || "",
                refresh_token: token.refresh_token || "",
                grant_type: "refresh_token",
            }),
        });

        console.log("response", refreshedToken);

        return {
            ...token,
            access_token: refreshedToken.access_token,
            access_token_expires: new Date(Date.now() + refreshedToken.expires_in * 1000),
            refresh_token: refreshedToken.refresh_token || token.refresh_token,
        };
    } catch (error) {
        console.error("Error refreshing access token", error);
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

// Función para obtener el perfil del usuario
async function fetchUserData(url: any, token: any) {
    try {
        const userData = await $fetch<UserData>(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("userData", userData);
        return userData.user;
    } catch (error) {
        console.error(`Error fetching user data from ${url}`, error);
        return null;
    }
}

// Verificación de variables de entorno
if (!process.env.NUXT_GEONODE_ISSUER || !process.env.NUXT_GEONODE_CLIENT_ID || !process.env.NUXT_GEONODE_CLIENT_SECRET) {
    throw new Error('Missing required environment variables for GeoNode authentication');
}

// Función para comprobar si el token ha expirado
function isTokenExpired(expiresAt: any) {
    return Date.now() >= expiresAt * 1000;
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
                console.log("fetchedUserData", fetchedUserData);
                if (fetchedUserData) {
                    profile = fetchedUserData;
                    profile.id = profile.pk;
                }
                return profile;
            },
        },
    ],

    callbacks: {
        async jwt({token, account}) {
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
                    access_token_expires_at: account.expires_at,
                };
                console.log("jwt", token.access_token_expires_at);
            }

            if (isTokenExpired(token.access_token_expires_at)) {
                console.log("Token expired, refreshing...");
                return await refreshAccessToken(token);
            }

            const fetchedUserData = await fetchUserData(`${GEONODE_APIV2_USERS_URL}/${token.id}`, token.access_token);
            if (fetchedUserData) {
                token.user = fetchedUserData;
                token.image = fetchedUserData.avatar;
            }
            return token;
        },
    },
});
