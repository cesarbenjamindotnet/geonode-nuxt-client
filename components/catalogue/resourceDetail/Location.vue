<template>
  <div class="row">
    <div class="col-5 q-pt-sm">
      <div class="row q-pl-md justify-between q-pb-xs">
        <div class="col-auto content-center">
          <span style="font-size: 12.4px;" class="text-grey-9">Bounding Box ({{ resourceData.extent.srid }})</span>
        </div>
        <div class="col-auto">
          <q-btn flat dense no-caps color="grey-9" class="q-ml-auto" @click="copyBoundigBoxToClipboard">
            <q-icon name="mdi-content-copy" size="18px"/>
          </q-btn>
        </div>
      </div>
      <q-table
          :rows="resourceExtent"
          row-key="name"
          wrap-cells
          dense
          :columns="columns"
          flat
          hide-bottom
          hide-header
          no-data-label="No data available"
          :rows-per-page="0"
          :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-value="props">
          <q-td :props="props">
            <template v-if="props.row.name === 'point_of_contact'">
              <NuxtLink :to="`/messages/create/${props.row.value.pk}`" style="text-decoration: none;">
                {{ props.row.value.username }}
              </NuxtLink>
            </template>
            <template v-else-if="props.row.name === 'owner'">
              <NuxtLink :to="`/people/profile/${props.row.value.pk}`" style="text-decoration: none;">
                {{ props.row.value.username }}
              </NuxtLink>
            </template>
            <template v-else>
              {{ props.row.value }}
            </template>
          </q-td>
        </template>
      </q-table>
      <q-separator/>

      <div class="row q-pl-md justify-between q-pb-xs q-pt-md">
        <div class="col-auto content-center">
          <span style="font-size: 12.4px;" class="text-grey-9">Center ({{ resourceData.extent.srid }})</span>
        </div>
        <div class="col-auto">
          <q-btn flat dense no-caps color="grey-9" class="q-ml-auto" @click="copyCenterToClipboard">
            <q-icon name="mdi-content-copy" size="18px"/>
          </q-btn>
        </div>
      </div>
      <q-table
          :rows="resourceCenter"
          row-key="name"
          wrap-cells
          dense
          :columns="columns"
          flat
          hide-bottom
          hide-header
          no-data-label="No data available"
          :rows-per-page="0"
          :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-value="props">
          <q-td :props="props">
            <template v-if="props.row.name === 'point_of_contact'">
              <NuxtLink :to="`/messages/create/${props.row.value.pk}`" style="text-decoration: none;">
                {{ props.row.value.username }}
              </NuxtLink>
            </template>
            <template v-else-if="props.row.name === 'owner'">
              <NuxtLink :to="`/people/profile/${props.row.value.pk}`" style="text-decoration: none;">
                {{ props.row.value.username }}
              </NuxtLink>
            </template>
            <template v-else>
              {{ props.row.value }}
            </template>
          </q-td>
        </template>
      </q-table>
      <q-separator/>
    </div>
    <div class="col-7 q-pl-sm q-pt-sm">
      <CatalogueResourceDetailLocationMap :resourceExtent="resourceData.extent" :key="resourceData.extent"/>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  resourceData: {
    type: Object,
    required: true
  }
})

interface Column {
  name: string;
  label: string;
  field: (row: any) => any;
  required?: boolean;
  align?: 'left' | 'center' | 'right';
  sortable: boolean;
  format?: (val: any) => string;
  classes?: string;
}

const columns: Column[] = [
  {
    name: 'name',
    label: 'Name',
    field: (row: any) => row.label,
    required: true,
    align: 'left',
    sortable: false,
    format: (val: any) => `${val}`,
    classes: 'column-name'
  },
  {
    name: 'value',
    label: 'Value',
    field: (row: any) => row.value,
    required: true,
    align: 'right',
    sortable: false,
    format: (val: any) => `${val}`,
    classes: 'column-value'
  }
]

const resourceExtent = computed<{ name: string; label: string; value: any }[]>(() => {
  const [xMin, yMin, xMax, yMax] = props.resourceData.extent.coords

  return [
    {name: 'min-lon', label: 'Min Lon', value: xMin.toFixed(8)},
    {name: 'min-lat', label: 'Min Lat', value: yMin.toFixed(8)},
    {name: 'max-lon', label: 'Max Lon', value: xMax.toFixed(8)},
    {name: 'max-lat', label: 'Max Lat', value: yMax.toFixed(8)},
  ]
})

const resourceCenter = computed<{ name: string; label: string; value: any }[]>(() => {
  const [xMin, yMin, xMax, yMax] = props.resourceData.extent.coords

  const x = (xMin + xMax) / 2;
  const y = (yMin + yMax) / 2;

  return [
    {name: 'lon', label: 'Lon', value: x.toFixed(8)},
    {name: 'lat', label: 'Lat', value: y.toFixed(8)},
  ]
})

const copyBoundigBoxToClipboard = () => {
  const [xMin, yMin, xMax, yMax] = props.resourceData.extent.coords
  const srid = props.resourceData.extent.srid.split(":").pop()
  const wkt = `SRID=${srid};POLYGON((${xMin} ${yMin}, ${xMin} ${yMax}, ${xMax} ${yMax}, ${xMax} ${yMin}, ${xMin} ${yMin}))`
  navigator.clipboard.writeText(wkt)
}

const copyCenterToClipboard = () => {
  const [xMin, yMin, xMax, yMax] = props.resourceData.extent.coords
  const srid = props.resourceData.extent.srid.split(":").pop()

  const x = (xMin + xMax) / 2
  const y = (yMin + yMax) / 2

  const wkt = `SRID=${srid};POINT(${x} ${y})`
  navigator.clipboard.writeText(wkt)
}


onMounted(() => {
  // alert("Info OnMounted")
  console.log('ResourceData', props.resourceData)
})
</script>

<style lang="scss" scoped>
.q-table {
  table-layout: fixed;
}

td.column-name {
  min-width: 124px;
  max-width: 124px;
}

td.column-name {
  width: 100%;
}
</style>
