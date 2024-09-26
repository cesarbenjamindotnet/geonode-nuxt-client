<template>
  <div class="row">
    <q-toggle
        v-model="catalogueStore.filterUsingExtent"
        checked-icon="mdi-map"
        color="primary"
        label="Extent"
        unchecked-icon="clear"
    />
  </div>
  <div class="row" style="margin-top: 4px;">
    <q-card style="width: 100%;">
      <client-only>
        <ol-map ref="olMapRef" style="height: 192px; width: 100%;" @moveend="moveEnd">
          <ol-view ref="olViewRef" :center="center" :zoom="-4" :projection="'EPSG:4326'"
                   :extent="extent"/>
          <ol-tile-layer>
            <ol-source-osm/>
          </ol-tile-layer>
          <ol-vector-layer v-if="catalogueStore.filterUsingExtent">
            <ol-source-vector>
              <ol-feature>
                <ol-geom-polygon :coordinates="catalogueStore.filterExtentPolygon"></ol-geom-polygon>
                <ol-style>
                  <ol-style-stroke :color="`${config.public.quasarBrand.accent}`" :width="2"></ol-style-stroke>
                  <ol-style-fill :color="`${config.public.quasarBrand.primary}50`"></ol-style-fill>
                </ol-style>
              </ol-feature>
            </ol-source-vector>
          </ol-vector-layer>
        </ol-map>
      </client-only>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import {View} from 'ol'

const router = useRouter()
const route = useRoute()
const catalogueStore = useCatalogueStore()
const config = useRuntimeConfig()

const olMapRef = ref(null)
const olViewRef = ref<View | null>(null)
const center = ref([0, 0])
const extent = ref([-180, -90, 180, 90])
const mounted = ref(false)


function moveEnd() {
  if (mounted.value && olViewRef.value) {
    catalogueStore.filterExtent = olViewRef.value.calculateExtent()
    const [xmin, ymin, xmax, ymax] = catalogueStore.filterExtent
    catalogueStore.filterExtentPolygon = [
      [
        [xmin, ymin],
        [xmin, ymax],
        [xmax, ymax],
        [xmax, ymin],
        [xmin, ymin],
      ],
    ];
  }
}

const updateQueryParams = () => {
  /**
   * This function updates the query parameters in the URL based on the changes on the filterExtent property
   * of the catalogueStore. If the filterExtent is empty, it removes the 'extent' query parameter from the URL.
   * When the filterExtent is not empty, it adds the 'extent' query parameter to the URL.
   */

  if (mounted.value && olViewRef.value) {
    olViewRef.value.fit(catalogueStore.filterExtent, {duration: 100})
  }

  const queryParams = {...route.query}

  if (catalogueStore.filterUsingExtent) {
    const [xmin, ymin, xmax, ymax] = catalogueStore.filterExtent
    queryParams.extent = `${xmin},${ymin},${xmax},${ymax}`
  } else {
    delete queryParams.extent
  }

  router.replace({path: route.path, query: queryParams})
}

const initializeExtentFromQueryParams = () => {
  /**
   * This function initializes the filterInputDateFrom property of the catalogueStore with the value of the 'filter{date.gte}'
   * query parameter in the URL. If the 'filter{date.gte}' query parameter is not present, it sets the filterInputDateFrom
   * property to an empty string.
   */

  const queryParamsExtent = route.query.extent

  if (queryParamsExtent) {
    const [xmin, ymin, xmax, ymax] = queryParamsExtent.toString().split(',')
    catalogueStore.filterUsingExtent = true
    catalogueStore.filterExtent = [parseFloat(xmin), parseFloat(ymin), parseFloat(xmax), parseFloat(ymax)]
    catalogueStore.filterExtentPolygon = [
      [
        [parseFloat(xmin), parseFloat(ymin)],
        [parseFloat(xmin), parseFloat(ymax)],
        [parseFloat(xmax), parseFloat(ymax)],
        [parseFloat(xmax), parseFloat(ymin)],
        [parseFloat(xmin), parseFloat(ymin)],
      ],
    ]
  } else {
    setTimeout(() => {
      catalogueStore.filterUsingExtent = false
      catalogueStore.filterExtent = [-180, -90, 180, 90]
      catalogueStore.filterExtentPolygon = [
        [
          [-180, -90],
          [-180, 90],
          [180, 90],
          [180, -90],
          [-180, -90],
        ],
      ]
      console.log("catalogueStore.filterExtent", catalogueStore.filterExtent)
    }, 300)
  }
}

onMounted(() => {
  if (!catalogueStore.hasPreviousRoute) {
    setTimeout(async () => {
      await initializeExtentFromQueryParams()
    }, 200)
  } else {
    catalogueStore.filterUsingExtent = false
    catalogueStore.filterExtent = [-180, -90, 180, 90]
    catalogueStore.filterExtentPolygon = [
      [
        [-180, -90],
        [-180, 90],
        [180, 90],
        [180, -90],
        [-180, -90],
      ],
    ]
  }

  setTimeout(() => {
    mounted.value = true
    if (mounted.value && olViewRef.value) {
      olViewRef.value.fit(catalogueStore.filterExtent, {duration: 400})
    }
  }, 300);
})

// Watch for changes on the filterInputSearch property of the catalogueStore,
// When the filterInputSearch property changes, it calls the updateQueryParams function
watch(
    [
      () => catalogueStore.filterUsingExtent,
      () => catalogueStore.filterExtent,
    ],
    () => updateQueryParams()
)

</script>
