import {NuxtAuthHandler} from '#auth'
import {OAuthConfig} from '@auth/core/providers'

export default NuxtAuthHandler({
    secret: useRuntimeConfig().authSecret || process.env.NEXTAUTH_SECRET,

    providers: [
        {
            id: "geonode",
            name: "GeoNode",
            type: "oauth",
            issuer: process.env.GEONODE_ISSUER,
            wellKnown: `${process.env.GEONODE_ISSUER}/.well-known/openid-configuration/`,
            clientId: process.env.GEONODE_CLIENT_ID || "",
            clientSecret: process.env.GEONODE_CLIENT_SECRET || "",
            authorization: {
                params: {scope: "openid read write groups profile"}
            },
            async profile(profile: any, token: any) {
                try {
                    const userProfileData = await $fetch(
                        `${process.env.GEONODE_BASEURL}/api/v2/users/${profile.sub}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token.access_token}`, // Usar el accessToken para la autenticación
                            },
                        }
                    );
                    profile = userProfileData?.user;
                    profile.id = profile.pk
                    console.log("Profile", profile)
                    return profile
                } catch (error) {
                    console.error("Error fetching user profile", error);
                }
                return profile
            },
        } as OAuthConfig,
    ],
    callbacks: {
        async session({session, token}) {
            // console.log("Session Callback session", session)
            // console.log("Session Callback user", user)
            // console.log("Session Callback token", token)
            session.user.accessToken = token.accessToken
            session.user.refreshToken = token.refreshToken
            session.user.id = token.sub
            session.user.profile = token.profile;
            // console.log("Session Callback session", session)
            return session
        },
        async jwt({token, account}) {
            if (account) {
                token.id = account.sub
                token.tokenType = account.token_type
                token.accessToken = account.access_token
                token.refreshToken = account.refresh_token
                token.idToken = account.id_token

                try {
                    const userProfileData = await $fetch(
                        `${process.env.GEONODE_BASEURL}/api/v2/users/${account.providerAccountId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${account.access_token}`, // Usar el accessToken para la autenticación
                            },
                        }
                    );
                    token.profile = userProfileData?.user;
                } catch (error) {
                    console.error("Error fetching user profile", error);
                }
            }
            return token
        }
    }
})