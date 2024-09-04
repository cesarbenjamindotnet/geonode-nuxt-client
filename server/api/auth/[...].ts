import {NuxtAuthHandler} from '#auth';

// Configuración de constantes
const GEONODE_BASE_URL = process.env.NUXT_GEONODE_BASE_URL || '';
const GEONODE_WELL_KNOWN_URL = `${process.env.NUXT_GEONODE_ISSUER}/.well-known/openid-configuration/`;
const GEONODE_APIV2_USERS_URL = `${GEONODE_BASE_URL}/api/v2/users`;

async function refreshAccessToken(token) {
  try {
    const url = `${process.env.NUXT_GEONODE_ISSUER}/token/?client_id=${process.env.NUXT_GEONODE_CLIENT_ID}&client_secret=${process.env.NUXT_GEONODE_CLIENT_SECRET}&refresh_token=${token.refresh_token}&grant_type=refresh_token`;

    const response = await $fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    console.log("response", response.json());

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    const newToken = {
      ...token,
      access_token: refreshedTokens.access_token,
      access_token_expires: Date(refreshedTokens.expires_in * 1000),
      refresh_token: refreshedTokens.refresh_token,
    }

    console.log("newToken", newToken);

    return newToken;
  } catch (error) {
    console.error("Error refreshing access token", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

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
        async jwt({token, account}) {
            console.log("cuenta: ", Date.now());
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
                        access_token_expires_at: account.expires_at * 1000,
                    };
                }

                const fetchedUserData = await fetchUserData(`${GEONODE_APIV2_USERS_URL}/${token.id}`, token.access_token || '');

                if (fetchedUserData && fetchedUserData.user) {
                    token.user = fetchedUserData.user;
                    token.image = fetchedUserData.user.avatar;
                }
                console.log("Date.now()", Date.now());
                console.log("Date token", new Date(token.access_token_expires_at).getTime());

                if (Date.now() < new Date(token.access_token_expires_at).getTime()) {
                    console.log("token fresco")
                    return token;
                }
                console.log("token expirado")
                return refreshAccessToken(token);
            }
            console.log("default return")
            return token;
        },
    },
});