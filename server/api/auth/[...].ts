import {NuxtAuthHandler} from '#auth';

// Configuración de constantes
const OIDC_WELL_KNOWN_URL = `${process.env.NUXT_OIDC_ISSUER}/.well-known/openid-configuration`;
const OIDC_USERINFO_URL = `${process.env.NUXT_OIDC_ISSUER}/protocol/openid-connect/userinfo`;

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
        const refreshedToken = await $fetch<RefreshToken>(`${process.env.NUXT_OIDC_ISSUER}/protocol/openid-connect/token`, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method: "POST",
            body: new URLSearchParams({
                client_id: process.env.NUXT_OIDC_CLIENT_ID ?? "",
                client_secret: process.env.NUXT_OIDC_CLIENT_SECRET ?? "",
                refresh_token: token.refresh_token ?? "",
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
        console.log(`User data fetched from ${url}:`, userData);
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
    secret: useRuntimeConfig().NEXT_AUTH_SECRET || process.env.NEXT_AUTH_SECRET,

    providers: [
        {
            id: process.env.NUXT_OIDC_CLIENT_ID || 'geonode',
            name: 'SIGICSSO',
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
                console.log("Received profile:", profile);
                console.log("Received token:", token);
                console.log("OIDC_USERINFO_URL:", OIDC_USERINFO_URL);
                let userProfile = profile;
                userProfile.id = profile.sub; // Ensure the profile has an id field


                const fetchedUserData = await fetchUserData(`${OIDC_USERINFO_URL}`, token.access_token);
                if (fetchedUserData) {
                    console.log("Fetched user data:", fetchedUserData);
                    userProfile = fetchedUserData;
                    userProfile.id = profile.sub;
                }
                console.log("Final profile:", profile);
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
                        id: account.email,
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
                    return await refreshAccessToken(token.refresh_token);
                }

                if (!token.user) {
                    const fetchedUserData = await fetchUserData(`${OIDC_USERINFO_URL}`, token.access_token);
                    if (fetchedUserData) {
                        token.user = fetchedUserData;
                    }
                }
                return token;
            }
        },
    },
});
