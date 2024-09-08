<template>
  <q-card style="width: 283px">
    <client-only>
      <ol-map ref="olMapRef" style="height: 168px; width: 283px;">
        <ol-view
            ref="olViewRef"
            :center="[0,0]"
            :zoom="-4"
            @change="mapChanged"
            :projection="'EPSG:4326'"
        />
        <ol-tile-layer>
          <ol-source-osm/>
        </ol-tile-layer>
      </ol-map>
    </client-only>
  </q-card>
</template>

<script setup lang="ts">
const olMapRef = ref(null);
const olViewRef = ref(null);
const catalogueStore = useCatalogueStore();

function mapChanged(event) {
  catalogueStore.filterExtent = olViewRef.value.calculateExtent();
  // extent.value = olViewRef.value.getExtent();


  console.log("mapChanged", event);
  console.log("olMapRef.value", olMapRef.value);
  console.log("olMapRef olMapRef.value.map.prototype.getSize()", olMapRef.value.map);
  console.log("olViewRef.value", olViewRef.value);
  console.log("catalogueStore.filterExtent", catalogueStore.filterExtent);
}
</script>

<style scoped>

</style>