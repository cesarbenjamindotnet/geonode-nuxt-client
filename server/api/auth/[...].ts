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
            profile(profile: any) {
                // console.log("Profile", profile)

                const userProfile = {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture
                }
                console.log("User Profile", userProfile)
                return userProfile
            },
        } as OAuthConfig,
    ],
    callbacks: {
        async session({session, user, token}) {
            console.log("Session Callback session", session)
            console.log("Session Callback user", user)
            console.log("Session Callback token", token)
            // session.user.accessToken = token.accessToken
            // session.user.id = token.sub
            return session
        },
        async jwt({token, user, account, profile, isNewUser}) {
            console.log("JWT token", token)
            console.log("JWT user", user)
            console.log("JWT account", account)
            console.log("JWT profile", profile)
            console.log("JWT isNewUser", isNewUser)

            return token
        }
    }

})