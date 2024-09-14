// stores/auth.ts

import {defineStore} from 'pinia';
import type {FacetItem} from "@/interfaces/catalogue";
import type {LocationQueryValue} from "vue-router";

export const useCatalogueStore = defineStore('catalogue', {
    state: () => ({
        hasPreviousRoute: false as boolean,
        filterUsingExtent: false as boolean,
        filterExtent: [-180, -90, 180, 90] as [number, number, number, number],
        filterExtentPolygon: [
            [
                [-180, -90],
                [-180, 90],
                [180, 90],
                [180, -90],
                [-180, -90],
            ]
        ] as number[][][],
        categoriesList: [] as FacetItem[],
        categoriesSelected: [] as LocationQueryValue[],
        keywordsList: [] as FacetItem[],
        keywordsSelected: [] as LocationQueryValue[],
        regionsList: [] as FacetItem[],
        regionsSelected: [] as LocationQueryValue[],
        ownersList: [] as FacetItem[],
        ownersSelected: [] as LocationQueryValue[],
        groupsList: [] as FacetItem[],
        groupsSelected: [] as LocationQueryValue[],
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
