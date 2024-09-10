<template>
  <q-card style="width: 100%;">
    <client-only>
      <ol-map v-if="true" ref="olMapRef" style="height: 168px; width: 100%;" @moveend="moveEnd">
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
              <ol-style-fill :color="'rgb(28,131,177, 0.5)'"></ol-style-fill>
              <ol-style-stroke :color="'#006dfc'" :width="2"></ol-style-stroke>
              </ol-style>
            </ol-feature>
          </ol-source-vector>
        </ol-vector-layer>
      </ol-map>
    </client-only>
  </q-card>
</template>

<script setup lang="ts">
const olMapRef = ref(null);
const olViewRef = ref(null);
const catalogueStore = useCatalogueStore();
const center = ref([0, 0]);
const extent = ref(catalogueStore.filterExtent);

/*
if (catalogueStore.filterExtent) {
  extent.value = catalogueStore.filterExtent;
}
*/

function moveEnd() {
  catalogueStore.filterExtent = olViewRef.value.calculateExtent();
  const [xmin, ymin, xmax, ymax] = catalogueStore.filterExtent;

  catalogueStore.filterExtentPolygon = [
    [
      [xmin, ymin],
      [xmin, ymax],
      [xmax, ymax],
      [xmax, ymin],
      [xmin, ymin],
    ],
  ];

  console.log("catalogueStore.filterExtentPolygon", catalogueStore.filterExtentPolygon);
}

</script>
