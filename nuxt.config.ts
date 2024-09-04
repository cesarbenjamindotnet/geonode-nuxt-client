// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    app: {
        head: {
            title: 'GeoNode Nuxt Client',
            meta: [
                {
                    name: 'description',
                    content: 'Geonode WebApp Client Made with Nuxt3 and VueJS 3 (As replacement Geonode Mapstore Client)'
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
            'composables/**'
        ]
    },
    quasar: {
        config: {
            brand: {
                primary: '#1976D2',
                secondary: '#26A69A',
                accent: '#9C27B0',
                dark: '#1D1D1D',
                "dark-page": '#121212',
                positive: '#21BA45',
                negative: '#C10015',
                info: '#31CCEC',
                warning: '#F2C037'
            },
        },
        iconSet: 'material-icons',
        extras: {
            fontIcons: ['mdi-v5']
        }
    },
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
        originEnvKey: 'NUXT_AUTH_ORIGIN',
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
    publicRuntimeConfig: {
        baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    },
    runtimeConfig: {
        public: {
            GEOSERVER_BASE_URL: process.env.NUXT_GEOSERVER_BASE_URL || 'http://localhost:8080/geoserver',
            GEONODE_BASE_URL: process.env.NUXT_GEONODE_BASE_URL || 'http://localhost:8000',
            GEONODE_FORCE_SCRIPT_NAME: process.env.NUXT_GEONODE_FORCE_SCRIPT_NAME || '',
            GEONODE_ADMIN_PATH: process.env.NUXT_GEONODE_ADMIN_PATH || '/admin',
        }
    }
})