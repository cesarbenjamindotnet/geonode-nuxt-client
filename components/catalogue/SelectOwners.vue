<template>
  <div class="row">
    <b>Owner</b>
  </div>
  <div class="row q-pb-md" style="margin-top: 4px;">
    <q-select outlined dense v-model="catalogueStore.ownersSelected"
              :options="catalogueStore.ownersList" label="Select owners"
              use-chips clearable
              option-value="key"
              :option-label="(item) => item.label + ' (' + item.count + ')'"
              emit-value
              map-options
              @clear="catalogueStore.ownersSelected = []"
              @update:model-value="updateQueryParams"
              popup-no-route-dismiss
              multiple use-input class="full-width" @virtual-scroll="handleSelectScroll"
              :loading="dataLoading"/>
  </div>
</template>

<script setup lang="ts">
import type {FacetsResponse, ScrollEvent} from "@/interfaces/catalogue"
import type {LocationQueryValue} from "vue-router";

const catalogueStore = useCatalogueStore()
const router = useRouter()
const route = useRoute()

const dataLoading = ref(false)
const dataPage = ref(0)
const dataPageSize = 20
const dataHasMore = ref(true)

const fetchOwners = async () => {
  /**
   * This function fetches owners from the API and adds them to the ownersList array in the catalogueStore.
   * It updates the ownersPage value to fetch the next page of owners.
   * If there are no more owners to fetch, it sets the ownersHasMore value to false.
   */

  if (dataLoading.value || !dataHasMore.value) return
  dataLoading.value = true
  const url = `https://development.demo.geonode.org/api/v2/facets/owner?page=${dataPage.value}&page_size=${dataPageSize}`

  try {
    const {data} = await useFetch<FacetsResponse>(url)
    const {topics: {items = []} = {}} = data.value || {}
    if (items.length) {
      catalogueStore.ownersList.push(...items.filter(item => !catalogueStore.ownersList.includes(item)))
      dataPage.value++
    } else {
      dataHasMore.value = false
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    dataLoading.value = false
  }
}

const handleSelectScroll = ({to}: ScrollEvent) => {
  /**
   * This function is called when the user scrolls the select component.
   * It checks if the user has reached the end of the list of owners and
   * calls the fetchDataItems function to load more owners.
   */

  if (!dataLoading.value && dataHasMore.value && to === catalogueStore.ownersList.length - 1) {
    fetchOwners();
  }
}

const updateQueryParams = () => {
  /**
   * This function updates the query parameters in the URL based on the changes on the ownersSelected property
   * of the catalogueStore. If the ownersSelected is empty, it removes the 'owners' query parameter from the URL.
   * When the ownersSelected is not empty, it adds the 'owners' query parameter to the URL.
   */

  const queryParams = {...route.query}

  if (!!catalogueStore.ownersSelected && catalogueStore.ownersSelected.length > 0) {
    queryParams[`filter{owner.pk.in}`] = catalogueStore.ownersSelected.map(String)
  } else {
    delete queryParams[`filter{owner.pk.in}`]
  }

  router.push({query: queryParams})
}

const initializeOwnersFromQueryParams = async () => {
  /**
   * This function initializes the ownersSelected property of the catalogueStore
   * based on the query parameters in the URL.
   * If the 'filter{owner.pk.in}' query parameter is present in the URL, it sets the ownersSelected
   * property of the catalogueStore to the values in the query parameter.
   * It fetches the owners from the API if the ownersSelected values are not present in the ownersList.
   */

  const queryParamsOwners: LocationQueryValue | LocationQueryValue[] | undefined = route.query['filter{owner.pk.in}']

  if (queryParamsOwners) {
    catalogueStore.ownersSelected = Array.isArray(queryParamsOwners) ? queryParamsOwners.map(Number) : [Number(queryParamsOwners)]

    console.log('ownersSelected:', catalogueStore.ownersSelected)

    while (!catalogueStore.ownersSelected.every(selectedKey =>
        catalogueStore.ownersList.some(category =>  category.key === selectedKey))) {
      await fetchOwners()
      if (!dataHasMore.value) break
    }
  }
}

onMounted(() => {
  if (!catalogueStore.hasPreviousRoute) {
    setTimeout(async () => {
      await initializeOwnersFromQueryParams()
    }, 800)
  } else {
    catalogueStore.ownersSelected = []
  }
})

watch(() => catalogueStore.leftDrawerOpen, () => {
  if (catalogueStore.leftDrawerOpen) {
    if (!catalogueStore.ownersList.length) fetchOwners()
  }
})

</script>
