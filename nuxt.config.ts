// https://nuxt.com/docs/api/configuration/nuxt-config
import {defineQuasarConfig} from './quasar.config'

export default defineNuxtConfig({

    app: {
        head: {
            title: 'GeoNode Nuxt Client',
            meta: [
                {
                    name: 'description',
                    content: 'Geonode WebApp Client Made with Nuxt3 and VueJS 3 (As replacement Geonode MapStore Client)'
                }
            ],
            link: [
                {rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons'}
            ]
        }
    },
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    components: true,
    imports: {
        dirs: [
            // Scan top-level modules
            'composables',
            // ... or scan all modules within given directory
            'composables/**',
        ]
    },
    quasar: defineQuasarConfig(),
    vue: {
        compilerOptions: {}
    },
    modules: [
        "@pinia/nuxt",
        "nuxt-quasar-ui",
        "@sidebase/nuxt-auth"
    ],
    auth: {
        isEnabled: true,
        disableServerSideAuth: false,
        baseURL: `${process.env.NUXT_PUBLIC_BASE_URL}`,
        provider: {
            type: 'authjs',
            trustHost: true,
        },
        sessionRefresh: {
            enablePeriodically: false,
            enableOnWindowFocus: true,
        },
    },
    runtimeConfig: {
        public: {
            quasarBrand: defineQuasarConfig().config.brand,
        },
        NUXT_OIDC_ISSUER: process.env.NUXT_OIDC_ISSUER ?? '',
        NUXT_OIDC_CLIENT_ID: process.env.NUXT_OIDC_CLIENT_ID ?? 'NUXT_OIDC_CLIENT_ID',
        NUXT_OIDC_CLIENT_SECRET: process.env.NUXT_OIDC_CLIENT_SECRET ?? 'NUXT_OIDC_CLIENT_SECRET',
        NEXT_AUTH_SECRET: process.env.NEXT_AUTH_SECRET ?? 'NEXT_AUTH_SECRET',
    }
})
