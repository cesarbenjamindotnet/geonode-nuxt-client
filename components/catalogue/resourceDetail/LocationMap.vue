<template>

  <div class="col-auto full-height" style="border: 1px solid darkgray;">
    <ol-map ref="olMapRef" :zoom="13" style="height: 250px;" :controls="[]" :interactions="[]">
      <ol-view ref="olViewRef" :projection="'EPSG:4326'"
      />

      <ol-tile-layer>
        <ol-source-osm/>
      </ol-tile-layer>
      <ol-vector-layer v-if="resourceExtentPolygon">
        <ol-source-vector>
          <ol-feature>
            <ol-geom-polygon :coordinates="resourceExtentPolygon"></ol-geom-polygon>
            <ol-style>
              <ol-style-stroke :color="`${config.public.quasarBrand.accent}`" :width="2"></ol-style-stroke>
              <ol-style-fill :color="`${config.public.quasarBrand.primary}50`"></ol-style-fill>
            </ol-style>
          </ol-feature>
        </ol-source-vector>
      </ol-vector-layer>

    </ol-map>
  </div>

</template>

<script setup lang="ts">
import {View} from "ol";

const catalogueStore = useCatalogueStore()
const config = useRuntimeConfig()

const olMapRef = ref(null)
const olViewRef = ref<View | null>(null)

const mdiCrossIconBase64 = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxsaW5lIHgxPSIxMiIgeTE9IjIiIHgyPSIxMiIgeTI9IjIyIi8+PGxpbmUgeDE9IjIiIHkxPSIxMiIgeDI9IjIyIiB5Mj0iMTIiLz48L3N2Zz4=' // SVG de cruz (mdi-cross) codificado en base64

const props = defineProps({
  resourceExtent: {
    type: Object,
    required: true
  }
})

const center = computed(() => {
  console.log("props.resourceExtent", props.resourceExtent.coords)
  const [xMin, yMin, xMax, yMax] = props.resourceExtent.coords

  const x = (xMin + xMax) / 2;
  const y = (yMin + yMax) / 2;
  console.log("center", x, y)
  return [x, y]
})

const resourceExtentPolygon = computed(() => {
  const [xMin, yMin, xMax, yMax] = props.resourceExtent.coords
  return [
    [
      [xMin, yMin],
      [xMin, yMax],
      [xMax, yMax],
      [xMax, yMin],
      [xMin, yMin],
    ],
  ];
})

watch(
    [
      () => resourceExtentPolygon
    ],
    () => {
      console.log("re", resourceExtentPolygon)
    })

onMounted(() => {
  console.log("resourceExtent", props.resourceExtent.coords)
  console.log("center", center.value)
  if (olViewRef.value) {
    olViewRef.value.fit(props.resourceExtent.coords, {padding: [50, 50, 50, 50]})
  }

})

</script>

<style scoped>

</style>