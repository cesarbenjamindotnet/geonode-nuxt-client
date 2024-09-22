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
    align: 'left',
    sortable: false,
    format: (val: any) => `${val}`,
    classes: 'column-value'
  }
]

const itemsList = computed<{ name: string; label: string; value: any }[]>(() => {
  let {
    title,
    owner,
    date,
    created,
    last_updated,
    resource_type,
    sourcetype,
    language,
    supplemental_information
  } = props.resourceData;

  if (sourcetype.length > 0) {
    sourcetype = sourcetype.toLowerCase();
    sourcetype = sourcetype.charAt(0).toUpperCase() + sourcetype.slice(1);
  }

  const formatDate = (dateValue: string | Date) => {
    return quasarDate.formatDate(dateValue, 'YYYY-MM-DD HH:mm');
  };

  return [
    {name: 'title', label: 'Title', value: title},
    {name: 'owner', label: 'Owner', value: owner},
    {name: 'published', label: 'Published', value: formatDate(date)},
    {name: 'added_at', label: 'Added at', value: formatDate(created)},
    {name: 'last_updated_at', label: 'Last updated at', value: formatDate(last_updated)},
    {name: 'resource_type', label: 'Resource type', value: resource_type},
    {name: 'source', label: 'Source', value: sourcetype},
    {name: 'point_of_contact', label: 'Point of contact', value: owner},
    {name: 'language', label: 'Language', value: language},
    {name: 'supplemental_information', label: 'Supplemental information', value: supplemental_information}
  ]
})

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
