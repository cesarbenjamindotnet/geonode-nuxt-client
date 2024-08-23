import {NuxtAuthHandler} from '#auth'
import GeoNodeProvider from "@/nuxt-auth/providers/geonode"

export default NuxtAuthHandler({
    secret: useRuntimeConfig().authSecret,
    providers: [
        GeoNodeProvider({
            issuer: process.env.GEONODE_ISSUER,
            clientId: process.env.GEONODE_CLIENT_ID,
            clientSecret: process.env.GEONODE_CLIENT_SECRET
        })
    ],
    callbacks: {
        /* on before signin */
        async signIn({user, account, profile, email, credentials}) {
            return true
        },
        /* on redirect to another url */
        async redirect({url, baseUrl}) {
            return baseUrl
        },
        /* on session retrival */
        async session({session, user, token}) {
            return session
        },
        /* on JWT token creation or mutation */
        async jwt({token, user, account, profile, isNewUser}) {
            return token
        }
    },

})