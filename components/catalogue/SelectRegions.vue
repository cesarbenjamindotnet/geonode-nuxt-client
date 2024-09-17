<template>
  <div class="row">
    <b>Region</b>
  </div>
  <div class="row q-pb-md" style="margin-top: 4px;">
    <q-select outlined dense v-model="catalogueStore.regionsSelected"
              :options="catalogueStore.regionsList" label="Select regions"
              use-chips clearable
              option-value="key"
              :option-label="(item) => item.label + ' (' + item.count + ')'"
              emit-value
              map-options
              @clear="catalogueStore.regionsSelected = []"
              @input-value="inputValue"
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
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const dataLoading = ref(false)
const dataPage = ref(0)
const dataPageSize = 20
const dataHasMore = ref(true)
const topic = ref<string>('');

const fetchRegions = async () => {
  /**
   * This function fetches regions from the API and adds them to the regionsList array in the catalogueStore.
   * It updates the regionsPage value to fetch the next page of regions.
   * If there are no more regions to fetch, it sets the regionsHasMore value to false.
   */

  if (dataLoading.value || !dataHasMore.value) return
  dataLoading.value = true
  const topicQuery = topic.value ? `&topic_contains=${topic.value}` : ''
  const url = `https://development.demo.geonode.org/api/v2/facets/region?page=${dataPage.value}&page_size=${dataPageSize}${topicQuery}`

  let headers = {}
  if (authStore.isAuthenticated) {
    // headers = {Authorization: `Bearer ${authStore.token.access_token}`}
    // TODO: implementar esto cuando tenga mejor armado el backend
  }

  try {
    const {data} = await useFetch<FacetsResponse>(url, {headers: headers})
    const {topics: {items = []} = {}} = data.value || {}
    if (items.length) {
      catalogueStore.regionsList.push(...items.filter(item => !catalogueStore.regionsList.some(region => region.key === item.key)))
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
   * It checks if the user has reached the end of the list of regions and
   * calls the fetchDataItems function to load more regions.
   */

  if (!dataLoading.value && dataHasMore.value && to === catalogueStore.regionsList.length - 1) {
    fetchRegions();
  }
};

const inputValue = (val: string) => {
  /**
   * This function filters the regionsList based on the input value.
   * It updates the regionsList in the catalogueStore with the filtered list of regions.
   */

  topic.value = val
  if (!val) {
    dataPage.value = 0
    dataHasMore.value = true
    fetchRegions()
  } else {
    catalogueStore.regionsList = []
    dataPage.value = 0
    dataHasMore.value = true
    fetchRegions()
  }
}

const updateQueryParams = () => {
  /**
   * This function updates the query parameters in the URL based on the changes on the regionsSelected property
   * of the catalogueStore. If the regionsSelected is empty, it removes the 'regions' query parameter from the URL.
   * When the regionsSelected is not empty, it adds the 'regions' query parameter to the URL.
   */

  const queryParams = {...route.query}

  if (!!catalogueStore.regionsSelected && catalogueStore.regionsSelected.length > 0) {
    queryParams[`filter{regions.code.in}`] = catalogueStore.regionsSelected
  } else {
    delete queryParams[`filter{regions.code.in}`]
  }

  router.replace({path: route.path, query: queryParams})
}

const initializeRegionsFromQueryParams = async () => {
  /**
   * This function initializes the regionsSelected property of the catalogueStore
   * based on the query parameters in the URL.
   * If the 'filter{regions.code.in}' query parameter is present in the URL, it sets the regionsSelected
   * property of the catalogueStore to the values in the query parameter.
   * It fetches the regions from the API if the regionsSelected values are not present in the regionsList.
   */

  const queryParamsRegions: LocationQueryValue | LocationQueryValue[] | undefined = route.query['filter{regions.code.in}']

  if (queryParamsRegions) {
    catalogueStore.regionsSelected = Array.isArray(queryParamsRegions) ? queryParamsRegions : [queryParamsRegions]

    while (!catalogueStore.regionsSelected.every(selectedKey =>
        catalogueStore.regionsList.some(category => category.key === selectedKey))) {
      await fetchRegions()
      if (!dataHasMore.value) break
    }
  }
}

onMounted(() => {
  if (!catalogueStore.hasPreviousRoute) {
    setTimeout(async () => {
      await initializeRegionsFromQueryParams()
    }, 800)
  } else {
    catalogueStore.regionsSelected = []
  }
})

watch(() => catalogueStore.showLeftDrawer, () => {
  if (catalogueStore.showLeftDrawer) {
    if (!catalogueStore.regionsList.length) fetchRegions()
  }
})

</script>
