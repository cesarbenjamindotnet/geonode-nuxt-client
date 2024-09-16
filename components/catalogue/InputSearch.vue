<template>
  <div class="row q-pb-md">
    <!-- TODO: implement i18n for placeholder -->
    <q-input outlined dense placeholder="Search" class="full-width" clearable
             v-model="catalogueStore.filterInputSearch"/>
  </div>
</template>

<script setup lang="ts">
const catalogueStore = useCatalogueStore()
const router = useRouter()
const route = useRoute()

const updateQueryParams = () => {
  /**
   * This function updates the query parameters in the URL based on the changes on the filterInputSearch property
   * of the catalogueStore. If the filterInputSearch is empty, it removes the 'q' query parameter from the URL.
   * When the filterInputSearch is not empty, it adds the 'q' query parameter to the URL.
   */

  const queryParams = {...route.query}

  if (catalogueStore.filterInputSearch) {
    queryParams.q = catalogueStore.filterInputSearch
  } else {
    delete queryParams.q
  }

  router.replace({path: route.path, query: queryParams})
}

const initializeSearchFromQueryParams = () => {
  /**
   * This function initializes the filterInputDateTo property of the catalogueStore with the value of the 'filter{date.lte}'
   * query parameter in the URL. If the 'filter{date.lte}' query parameter is not present, it sets the filterInputDateTo
   * property to an empty string.
   */

  if (route.query.q) {
    catalogueStore.filterInputSearch = route.query.q?.toString()
  } else {
    catalogueStore.filterInputSearch = undefined
  }
}

onMounted(() => {
  if (!catalogueStore.hasPreviousRoute) {
    setTimeout(async () => {
      await initializeSearchFromQueryParams()
    }, 400)
  } else {
    catalogueStore.filterInputSearch = undefined
  }
})

// Watch for changes on the filterInputSearch property of the catalogueStore,
// When the filterInputSearch property changes, it calls the updateQueryParams function
watch(
    [() => catalogueStore.filterInputSearch],
    () => updateQueryParams()
)

</script>
