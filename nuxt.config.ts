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
        baseURL: 'http://localhost:3000/api/auth',
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
            NUXT_BASE_URL: process.env.NUXT_BASE_URL || 'http://localhost:3000',
            GEOSERVER_BASEURL: process.env.NUXT_GEOSERVER_BASEURL || 'http://localhost:8080/geoserver',
            GEONODE_BASEURL: process.env.NUXT_GEONODE_BASEURL || 'http://localhost:8080',
            GEONODE_FORCE_SCRIPT_NAME: process.env.NUXT_GEONODE_FORCE_SCRIPT_NAME || '',
            GEONODE_ADMIN_PATH: process.env.NUXT_GEONODE_ADMIN_PATH || '/admin',
            NUXT_ZOO_BASEURL: process.env.NUXT_ZOO_BASEURL || 'http://localhost',
            NUXT_OIDC_ISSUER: process.env.NUXT_OIDC_ISSUER || 'http://localhost:8080/realms/zooproject',
            NUXT_OIDC_CLIENT_ID: process.env.NUXT_OIDC_CLIENT_ID || 'keycloak',
            NUXT_OIDC_CLIENT_SECRET: process.env.NUXT_OIDC_CLIENT_SECRET || 'keycloak-secret',
            NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'NEXTAUTH_SECRET',
        }
    }
})
