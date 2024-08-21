import { NuxtAuthHandler } from '#auth'
// import TwitterProvider from "next-auth/providers/twitter"
import GeoNodeProvider from "@/nuxt-auth/providers/geonode"

export default NuxtAuthHandler({
    providers: [
        GeoNodeProvider({
            clientId: process.env.TWITTER_CLIENT_ID,
            clientSecret: process.env.TWITTER_CLIENT_SECRET
        })
    ]
})