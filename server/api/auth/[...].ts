import {NuxtAuthHandler} from '#auth';
import {OAuthConfig} from '@auth/core/providers';


// Configuración de constantes
const GEONODE_BASE_URL = process.env.GEONODE_BASE_URL || '';
const GEONODE_WELL_KNOWN_URL = `${process.env.GEONODE_ISSUER}/.well-known/openid-configuration/`;
const GEONODE_PROFILE_URL = `${GEONODE_BASE_URL}/api/v2/users`;


async function fetchUserProfile(url: string, token: string) {
    try {
        const userProfileData = await $fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
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
}

export default NuxtAuthHandler({
    secret: useRuntimeConfig().authSecret || process.env.NEXTAUTH_SECRET,

    providers: [
        {
            id: 'geonode',
            name: 'GeoNode',
            type: 'oauth',
            issuer: process.env.GEONODE_ISSUER,
            wellKnown: GEONODE_WELL_KNOWN_URL,
            clientId: process.env.GEONODE_CLIENT_ID || '',
            clientSecret: process.env.GEONODE_CLIENT_SECRET || '',

            async profile(profile: any, token: any) {
                const fetchedProfile = await fetchUserProfile(`${GEONODE_PROFILE_URL}/${profile.sub}`, token.access_token);
                if (fetchedProfile) {
                    profile = fetchedProfile;
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
                };

                const fetchedProfile = await fetchUserProfile(`${GEONODE_PROFILE_URL}/${account.providerAccountId}`, account.access_token || '');

                if (fetchedProfile) {
                    token.picture = fetchedProfile.avatar;
                    token.name = (fetchedProfile.first_name + ' ' + fetchedProfile.last_name).trim();
                }
            }
            return token;
        },
    },
});
