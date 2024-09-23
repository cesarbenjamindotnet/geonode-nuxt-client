<template>
  <div class="row">
    <b>Resources</b>
  </div>
  <div class="row q-pb-md" style="margin-top: 0">
    <q-tree
        :nodes="filteredResourceTreeNodes"
        v-model:ticked="catalogueStore.resourceTreeNodesSelected"
        node-key="value"
        tick-strategy="leaf"
        default-expand-all
        no-connectors
        dense
    />
  </div>
</template>

<script setup lang="ts">
import type {LocationQueryValue} from 'vue-router'
import type {ResourceTreeNode} from "@/interfaces/catalogue"

const catalogueStore = useCatalogueStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()


const resourceTreeNodes: ResourceTreeNode[] = [
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
]

const filteredResourceTreeNodes = computed(() => {
  const filterNodes = (nodes: ResourceTreeNode[]) => {
    return nodes.filter((node) => {
      // Regla 1: Siempre mostrar estos nodos, si cumplen la regla de autenticación
      const alwaysVisibleNodes = [
        'my-resources',
        'favorite',
        'featured',
        'unpublished',
        'pending-approval',
      ];

      // Si el nodo está en alwaysVisibleNodes, revisa la autenticación si es necesario
      if (alwaysVisibleNodes.includes(node.value)) {
        if (node.showIfUserIsLoggedIn && !authStore.user) {
          return false;
        }
        return true;
      }

      if (node.value === 'dataset' && route.path === '/catalogue/dataset') {
        return true;
      }

      if (node.value === 'remote' && ['/catalogue/dataset', '/catalogue/document'].includes(route.path)) {
        return true;
      }

      if (['/catalogue', '/catalogue/all'].includes(route.path)) {
        return true;
      }

      // Filtrar nodos con hijos
      if (node.children) {
        node.children = filterNodes(node.children);
      }

      return false; // Si no cumple ninguna condición, no se muestra
    });
  };

  return filterNodes(resourceTreeNodes);
});

const updateQueryParams = () => {
  const queryParams = {...route.query}
  console.log("updateQueryParams", catalogueStore.resourceTreeNodesSelected)

  // Obtener los nodos hijos del tipo 'dataset'
  const datasetNode = resourceTreeNodes.find(node => node.value === 'dataset')
  let datasetChildren: any[] = []

  if (datasetNode && datasetNode.children) {
    datasetChildren = datasetNode.children.map(child => child.value)
  }

  let datasetSelected = false

  const datasetTicked = catalogueStore.resourceTreeNodesSelected.filter(item => datasetChildren.includes(item))
  const allDatasetChildrenSelected = datasetTicked.length === datasetChildren.length

  let filters: LocationQueryValue[]
  filters = catalogueStore.resourceTreeNodesSelected.reduce<LocationQueryValue[]>((acc, item) => {
    if (datasetChildren.includes(item)) {
      datasetSelected = true
      if (!allDatasetChildrenSelected) {
        acc.push(item) // Agregamos cada hijo si no están todos seleccionados
      }
    } else {
      acc.push(item) // Para todos los nodos que no son hijos de dataset
    }
    return acc
  }, []);

  if (datasetSelected && !filters.includes('dataset')) {
    filters.push('dataset')
  }

  if (filters.length > 0) {
    queryParams.f = filters
  } else {
    delete queryParams.f
  }

  router.replace({path: route.path, query: queryParams})
}

// Función para inicializar el estado de 'ticked' según los query params
const initializeTickedFromQuery = async () => {
  const queryParamsTicked: LocationQueryValue | LocationQueryValue[] | undefined = route.query.f
  const datasetCategories = ["store-vector", "store-raster", "store-time-series", "3dtiles", "tabular"]

  if (Object.keys(route.query).length > 0) {
    catalogueStore.showLeftDrawer = true
  }

  if (queryParamsTicked) {
    console.log("queryParamsTicked", queryParamsTicked)
    let selectedValues = Array.isArray(queryParamsTicked) ? queryParamsTicked : [queryParamsTicked]
    console.log("selectedValues", selectedValues)

    if (selectedValues.includes("dataset")) {
      // Verifica si alguna de las categorías necesarias está en el array
      const hasAllDatasetCategories = datasetCategories.some(category => selectedValues.includes(category));

      // Si no hay ninguna de las categorías requeridas, las agregamos al array
      if (!hasAllDatasetCategories) {
        selectedValues = selectedValues.concat(datasetCategories);
      }
    }

    catalogueStore.resourceTreeNodesSelected = selectedValues
    console.log("catalogueStore.resourceTreeNodesSelected", catalogueStore.resourceTreeNodesSelected)
  }
}

onMounted(() => {
  if (!catalogueStore.hasPreviousRoute) {
    setTimeout(async () => {
      await initializeTickedFromQuery()
    }, 400)
  } else {
    catalogueStore.resourceTreeNodesSelected = []
  }
})

// Watch for changes on the filterInputSearch property of the catalogueStore,
// When the filterInputSearch property changes, it calls the updateQueryParams function
watch(
    [() => catalogueStore.resourceTreeNodesSelected],
    () => updateQueryParams()
)

</script>
