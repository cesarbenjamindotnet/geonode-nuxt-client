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
        baseURL: `${process.env.NUXT_BASE_URL}/api/auth`,
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
            NUXT_BASE_URL: '',
            NUXT_PUBLIC_GEOSERVER_BASEURL: '',
            NUXT_PUBLIC_GEONODE_BASEURL: '',
            NUXT_PUBLIC_GEONODE_FORCE_SCRIPT_NAME: '',
            NUXT_PUBLIC_GEONODE_ADMIN_PATH: '/admin',
        },
        NUXT_OIDC_ISSUER: '',
        NUXT_OIDC_CLIENT_ID: '',
        NUXT_OIDC_CLIENT_SECRET: '',
        NEXTAUTH_SECRET: '',
    }
})
