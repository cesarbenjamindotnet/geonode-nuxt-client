import type {QuasarIconSets} from 'quasar'

export type QuasarFontIconSet =
    | "bootstrap-icons"
    | "eva-icons"
    | "fontawesome-v5"
    | "fontawesome-v5-pro"
    | "fontawesome-v6"
    | "fontawesome-v6-pro"
    | "ionicons-v4"
    | "line-awesome"
    | "material-icons"
    | "material-icons-outlined"
    | "material-icons-round"
    | "material-icons-sharp"
    | "material-symbols-outlined"
    | "material-symbols-rounded"
    | "material-symbols-sharp"
    | "mdi-v3"
    | "mdi-v4"
    | "mdi-v5"
    | "mdi-v6"
    | "mdi-v7"
    | "themify";

export function defineQuasarConfig() {
    return {
        plugins: [
            'LoadingBar',
        ],
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
            loadingBar: {
                color: 'blue', // Color de la barra de carga
                size: '3px',    // Tamaño de la barra
                position: 'top' // Posición de la barra (top o bottom)
            }
        },
        iconSet: 'material-icons' as QuasarIconSets,
        extras: {
            fontIcons: ['mdi-v5'] as QuasarFontIconSet[],
        }
    }
}