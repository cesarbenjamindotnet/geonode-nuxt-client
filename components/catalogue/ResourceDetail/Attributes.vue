<template>
  <q-table
      :rows="resourceData.attribute_set"
      row-key="name"
      wrap-cells
      dense
      :columns="columns"
      flat
      hide-bottom
      no-data-label="No data available"
      :rows-per-page="0"
      :rows-per-page-options="[]"
  >
  </q-table>
  <q-separator/>
</template>

<script setup lang="ts">
import {date as quasarDate} from 'quasar';

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

const props = defineProps({
  resourceData: {
    type: Object,
    required: true
  }
})

const columns: Column[] = [
  {
    name: 'name',
    label: 'Name',
    field: (row: any) => row.attribute,
    required: true,
    align: 'left',
    sortable: false,
    format: (val: any) => `${val}`,
    classes: 'column-name'
  },
  {
    name: 'label',
    label: 'Label',
    field: (row: any) => row.attribute_label || 'N/A',
    required: true,
    align: 'left',
    sortable: false,
    format: (val: any) => `${val}`,
    classes: 'column-value'
  },
    {
    name: 'description',
    label: 'Description',
    field: (row: any) => row.description || 'N/A',
    required: true,
    align: 'left',
    sortable: false,
    format: (val: any) => `${val}`,
    classes: 'column-value'
  }
]


onMounted(() => {
  // alert("Info OnMounted")
  console.log('onMounted ResourceData', props.resourceData)
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
