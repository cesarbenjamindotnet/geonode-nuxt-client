<template>
  <q-card style="width: 100%;">
    <client-only>
      <ol-map v-if="true" ref="olMapRef" style="height: 168px; width: 100%;">
        <ol-view ref="olViewRef" :center="center" :zoom="-4" @change="mapChanged" :projection="'EPSG:4326'"/>
        <ol-tile-layer>
          <ol-source-osm/>
        </ol-tile-layer>
        <ol-vector-layer v-if="catalogueStore.filterUsingExtent">
          <ol-source-vector>
            <ol-feature>
              <ol-geom-polygon :coordinates="polygonCoordinates"></ol-geom-polygon>
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
const polygonCoordinates = ref([]);
const center = ref([0, 0]);

function mapChanged(event) {
  catalogueStore.filterExtent = olViewRef.value.calculateExtent();
  const [xmin, ymin, xmax, ymax] = catalogueStore.filterExtent;

  polygonCoordinates.value = [
    [
      [xmin, ymin],
      [xmin, ymax],
      [xmax, ymax],
      [xmax, ymin],
      [xmin, ymin],
    ],
  ];

  console.log("polygonCoordinates", polygonCoordinates.value);
}

</script>

<style scoped>

</style>