import {NuxtAuthHandler} from '#auth';

// Configuración de constantes
const APP_BASEURL = process.env.NUXT_APP_BASEURL || '';
const OIDC_WELL_KNOWN_URL = `${process.env.NUXT_OIDC_ISSUER}/.well-known/openid-configuration/`;
const GEONODE_API_V2_USERS_URL = `${APP_BASEURL}/api/v2/users`;

const config = useRuntimeConfig()

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
        const refreshedToken = await $fetch<RefreshToken>(`${process.env.NUXT_OIDC_ISSUER}/token/`, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
            body: new URLSearchParams({
                client_id: process.env.NUXT_OIDC_CLIENT_ID || "",
                client_secret: process.env.NUXT_OIDC_CLIENT_SECRET || "",
                refresh_token: token.refresh_token || "",
                grant_type: "refresh_token",
            }),
        });

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
        return userData.user;
    } catch (error) {
        console.error(`Error fetching user data from ${url}`, error);
        return null;
    }
}

// Verificación de variables de entorno
if (!process.env.NUXT_OIDC_ISSUER || !process.env.NUXT_OIDC_CLIENT_ID || !process.env.NUXT_OIDC_CLIENT_SECRET) {
    throw new Error('Missing required environment variables for GeoNode authentication');
}

// Función para comprobar si el token ha expirado
function isTokenExpired(expiresAt: any) {
    return Date.now() >= expiresAt * 1000;
}

export default NuxtAuthHandler({
    secret: config.public.NEXTAUTH_SECRET.toString() || 'default-secret',

    providers: [
        {
            id: 'keycloak',
            name: 'Keycloak',
            type: 'oauth',
            issuer: process.env.NUXT_OIDC_ISSUER,
            wellKnown: OIDC_WELL_KNOWN_URL,
            clientId: process.env.NUXT_OIDC_CLIENT_ID || '',
            clientSecret: process.env.NUXT_OIDC_CLIENT_SECRET || '',
            authorization: {
                params: {
                    scope: 'openid profile email',
                },
            },
            async profile(profile: any, token: any) {
                profile.id = profile.sub;
                return profile;
            },
        },
    ],

    callbacks: {
        async session({session, token}) {
            if (token && token.user) {
                session.user = token.user
            }
            return session;
        },
        async jwt({token, account}) {
            if (token) {
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
                }

                if (isTokenExpired(token.access_token_expires_at)) {
                    console.log("Token expired, refreshing...");
                    return await refreshAccessToken(token);
                }

                if (!token.user) {
                    const fetchedUserData = await fetchUserData(`${GEONODE_API_V2_USERS_URL}/${token.id}`, token.access_token);
                    if (fetchedUserData) {
                        token.user = fetchedUserData;
                    }
                }
                return token;
            }
        },
    },
});
