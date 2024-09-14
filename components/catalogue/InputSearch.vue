<template>
  <div class="row q-pb-md">
    <q-input outlined dense placeholder="Search" class="full-width" clearable
             v-model="catalogueStore.filterInputSearch"/>
  </div>
</template>

<script setup lang="ts">
const catalogueStore = useCatalogueStore()
const router = useRouter()
const route = useRoute()

const updateQueryParams = () => {
  const queryParams = {...route.query}

  if (catalogueStore.filterInputSearch) {
    queryParams.q = catalogueStore.filterInputSearch
  } else {
    delete queryParams.q
  }

  router.push({query: queryParams})
}

watch(
    [() => catalogueStore.filterInputSearch], // It watches the filterInputSearch property for changes
    () => updateQueryParams()                 // When the filterInputSearch property changes, it calls the updateQueryParams function
)

</script>
