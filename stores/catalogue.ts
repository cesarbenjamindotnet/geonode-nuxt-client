// stores/auth.ts

import {defineStore} from 'pinia';
import type {FacetItem, ResourceTreeNode} from "@/interfaces/catalogue";
import type {LocationQueryValue} from "vue-router";

export const useCatalogueStore = defineStore('catalogue', {
    state: () => ({
        showLeftDrawer: false as boolean,
        showRightDrawer: false as boolean,
        hasPreviousRoute: false as boolean,
        filterLoading: false as boolean,
        resourcesCount: 0 as number,
        resources: [] as any[],

        pageNumber: 0 as number,

        filterData: [] as any[],

        filterInputSearch: undefined as undefined | string,
        resourceTreeNodes: [
            {value: 'my-resources', label: 'My resources', showIfUserIsLoggedIn: true},
            {value: 'favorite', label: 'Favorites', showIfUserIsLoggedIn: true},
            {value: 'featured', label: 'Featured'},
            {value: 'unpublished', label: 'Unpublished', showIfUserIsLoggedIn: true},
            {value: 'pending-approval', label: 'Pending approval', showIfUserIsLoggedIn: true},
            {
                value: 'dataset', label: 'Datasets', children: [
                    {value: 'store-vector', label: 'Vector'},
                    {value: 'store-raster', label: 'Raster'},
                    {value: 'store-time-series', label: 'Time series'},
                    {value: '3dtiles', label: '3D Tiles'},
                    {value: 'tabular', label: 'Tabular'},
                ]
            },
            {value: 'map', label: 'Maps'},
            {value: 'mapviewer', label: 'Maps Viewers'},
            {value: 'document', label: 'Documents'},
            {value: 'geostory', label: 'GeoStories'},
            {value: 'dashboard', label: 'Dashboards'},
            {value: 'remote', label: 'Remote'},
        ] as ResourceTreeNode[],
        resourceTreeNodesSelected: [] as LocationQueryValue[],
        categoriesList: [] as FacetItem[],
        categoriesSelected: [] as LocationQueryValue[],
        keywordsList: [] as FacetItem[],
        keywordsSelected: [] as LocationQueryValue[],
        regionsList: [] as FacetItem[],
        regionsSelected: [] as LocationQueryValue[],
        ownersList: [] as FacetItem[],
        ownersSelected: [] as LocationQueryValue[] | number[],
        groupsList: [] as FacetItem[],
        groupsSelected: [] as LocationQueryValue[] | number[],
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

        filterInputDateFrom: undefined as undefined | string,
        filterInputDateTo: undefined as undefined | string,
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
