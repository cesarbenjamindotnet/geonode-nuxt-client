<template>
  <q-table
      :rows="itemsList"
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
    <q-separator />

  </q-table>
</template>

<script setup lang="ts">

interface Column {
  name: string;
  label: string;
  field: (row: any) => any;
  required?: boolean;
  align?: 'left' | 'center' | 'right';
  sortable: boolean;
  format?: (val: any) => string;
}

const props = defineProps({
  resourceData: Object,
})

const columns: Column[] = [
  { name: 'name', label: 'Name', field: (row: any) => row.name, required: true, align: 'left', sortable: false, format: (val: any) => `${val}`},
  { name: 'value', label: 'Value', field: (row: any) => row.value, required: true, align: 'left', sortable: false, format: (val: any) => `${val}`}
];

const itemsList = computed(() => [
  {name: 'Title', value: props.resourceData.title},
  {name: 'Owner', value: props.resourceData.owner},
  {name: 'Published', value: props.resourceData.date},
  {name: 'Added at', value: props.resourceData.created},
  {name: 'Last updated at', value: props.resourceData.last_updated},
  {name: 'Resource type', value: props.resourceData.resource_type},
  {name: 'Source', value: props.resourceData.source},
  {name: 'Point of contact', value: props.resourceData.owner},
  {name: 'Language', value: props.resourceData.languague},
  {name: 'Supplemental information', value: props.resourceData.supplemental_information},
])

</script>

<style scoped>

</style>