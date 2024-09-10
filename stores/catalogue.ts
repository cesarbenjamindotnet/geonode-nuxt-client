// stores/auth.ts

import {defineStore} from 'pinia';


export const useCatalogueStore = defineStore('catalogue', {
    state: () => ({
        filterUsingExtent: false,
        filterExtent: [-180, -90, 180, 90],
        filterExtentPolygon: [
            [
                [-180, -90],
                [-180, 90],
                [180, 90],
                [180, -90],
                [-180, -90],
            ]
        ],

    }),
    getters: {
        getFilterUsingExtent: state => state.filterUsingExtent,
    },
    actions: {
        clearFilter() {
            // TODO: implementar que se use esta función para cerrar sesión
            this.filterExtent = [-180, -90, 180, 90];
        },
    },
});
