<template>
  <q-card style="width: 100%;">
    <client-only>
      <ol-map v-if="true" ref="olMapRef" style="height: 192px; width: 100%;" @moveend="moveEnd">
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
                <ol-style-stroke :color="`${config.public.quasarBrand.accent}`"></ol-style-stroke>
                <ol-style-fill :color="`${config.public.quasarBrand.primary}50`"></ol-style-fill>
              </ol-style>
            </ol-feature>
          </ol-source-vector>
        </ol-vector-layer>
      </ol-map>
    </client-only>
  </q-card>
</template>

<script setup lang="ts">
import {View} from 'ol'
const olMapRef = ref(null)
const olViewRef = ref<View | null>(null)
const catalogueStore = useCatalogueStore()
const center = ref([0, 0])
const extent = ref([-180, -90, 180, 90])
const mounted = ref(false)

const config = useRuntimeConfig()

onMounted(() => {
  setTimeout(() => {
    mounted.value = true
    if (mounted.value && olViewRef.value) {
      olViewRef.value.fit(catalogueStore.filterExtent, {duration: 400})
    }
  }, 200);
})

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

</script>
