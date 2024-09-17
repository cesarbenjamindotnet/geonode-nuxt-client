<template>
  <div class="row">
    <b>Keyword</b>
  </div>
  <div class="row q-pb-md" style="margin-top: 4px;">
    <q-select outlined dense v-model="catalogueStore.keywordsSelected"
              :options="catalogueStore.keywordsList" label="Select keywords"
              use-chips clearable
              option-value="key"
              :option-label="(item) => item.label + ' (' + item.count + ')'"
              emit-value
              map-options
              @clear="catalogueStore.keywordsSelected = []"
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

const fetchKeywords = async () => {
  /**
   * This function fetches keywords from the API and adds them to the keywordsList array in the catalogueStore.
   * It updates the keywordsPage value to fetch the next page of keywords.
   * If there are no more keywords to fetch, it sets the keywordsHasMore value to false.
   */

  if (dataLoading.value || !dataHasMore.value) return
  dataLoading.value = true
  const topicQuery = topic.value ? `&topic_contains=${topic.value}` : ''
  const url = `https://development.demo.geonode.org/api/v2/facets/keyword?page=${dataPage.value}&page_size=${dataPageSize}${topicQuery}`

  let headers = {}
  if (authStore.isAuthenticated) {
    // headers = {Authorization: `Bearer ${authStore.token.access_token}`}
    // TODO: implementar esto cuando tenga mejor armado el backend
  }

  try {
    const {data} = await useFetch<FacetsResponse>(url, {headers: headers})
    const {topics: {items = []} = {}} = data.value || {};
    if (items.length) {
      catalogueStore.keywordsList.push(...items.filter(item => !catalogueStore.keywordsList.some(keyword => keyword.key === item.key)))
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
   * It checks if the user has reached the end of the list of keywords and
   * calls the fetchDataItems function to load more keywords.
   */

  console.log("to", to)

  if (!dataLoading.value && dataHasMore.value && to === catalogueStore.keywordsList.length - 1) {
    fetchKeywords();
  }
}

const inputValue = (val: string) => {
  /**
   * This function filters the keywordsList based on the input value.
   * It updates the keywordsList in the catalogueStore with the filtered list of keywords.
   */

  topic.value = val
  if (!val) {
    dataPage.value = 0
    dataHasMore.value = true
    fetchKeywords()
  } else {
    catalogueStore.keywordsList = []
    dataPage.value = 0
    dataHasMore.value = true
    fetchKeywords()
  }
}

const updateQueryParams = () => {
  /**
   * This function updates the query parameters in the URL based on the changes on the keywordsSelected property
   * of the catalogueStore. If the keywordsSelected is empty, it removes the 'keywords' query parameter from the URL.
   * When the keywordsSelected is not empty, it adds the 'keywords' query parameter to the URL.
   */

  const queryParams = {...route.query}

  if (!!catalogueStore.keywordsSelected && catalogueStore.keywordsSelected.length > 0) {
    queryParams[`filter{keywords.slug.in}`] = catalogueStore.keywordsSelected
  } else {
    delete queryParams[`filter{keywords.slug.in}`]
  }

  router.replace({path: route.path, query: queryParams})
}

const initializeKeywordsFromQueryParams = async () => {
  /**
   * This function initializes the keywordsSelected property of the catalogueStore
   * based on the query parameters in the URL.
   * If the 'filter{keywords.slug.in}' query parameter is present in the URL, it sets the keywordsSelected
   * property of the catalogueStore to the values in the query parameter.
   * It fetches the keywords from the API if the keywordsSelected values are not present in the keywordsList.
   */

  const queryParamsKeywords: LocationQueryValue | LocationQueryValue[] | undefined = route.query['filter{keywords.slug.in}']

  if (queryParamsKeywords) {
    catalogueStore.keywordsSelected = Array.isArray(queryParamsKeywords) ? queryParamsKeywords : [queryParamsKeywords]

    while (!catalogueStore.keywordsSelected.every(selectedKey =>
        catalogueStore.keywordsList.some(category => category.key === selectedKey))) {
      await fetchKeywords()
      if (!dataHasMore.value) break
    }
  }
}

onMounted(() => {
  if (!catalogueStore.hasPreviousRoute) {
    setTimeout(async () => {
      await initializeKeywordsFromQueryParams()
    }, 800)
  } else {
    catalogueStore.keywordsSelected = []
  }
})

watch(() => catalogueStore.showLeftDrawer, () => {
  if (catalogueStore.showLeftDrawer) {
    if (!catalogueStore.keywordsList.length) fetchKeywords()
  }
})

</script>
