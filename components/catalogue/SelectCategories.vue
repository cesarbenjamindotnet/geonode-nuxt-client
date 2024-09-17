<template>
  <div class="row">
    <b>Category</b>
  </div>
  <div class="row q-pb-md" style="margin-top: 4px;">
    <q-select outlined dense v-model="catalogueStore.categoriesSelected"
              :options="catalogueStore.categoriesList" label="Select categories"
              use-chips clearable
              option-value="key"
              :option-label="(item) => item.label + ' (' + item.count + ')'"
              emit-value
              map-options
              @clear="catalogueStore.categoriesSelected = []"
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

const fetchCategories = async () => {
  /**
   * This function fetches categories from the API and adds them to the categoriesList array in the catalogueStore.
   * It updates the categoriesPage value to fetch the next page of categories.
   * If there are no more categories to fetch, it sets the categoriesHasMore value to false.
   */

  if (dataLoading.value || !dataHasMore.value) return
  dataLoading.value = true
  const topicQuery = topic.value ? `&topic_contains=${topic.value}` : ''
  const url = `https://development.demo.geonode.org/api/v2/facets/category?page=${dataPage.value}&page_size=${dataPageSize}${topicQuery}`

  let headers = {}
  if (authStore.isAuthenticated) {
    // headers = {Authorization: `Bearer ${authStore.token.access_token}`}
    // TODO: implementar esto cuando tenga mejor armado el backend
  }

  try {
    const {data} = await useFetch<FacetsResponse>(url, {headers: headers})
    const {topics: {items = []} = {}} = data.value || {}
    if (items.length) {
      catalogueStore.categoriesList.push(...items.filter(item => !catalogueStore.categoriesList.some(category => category.key === item.key)))
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
   * It checks if the user has reached the end of the list of categories and
   * calls the fetchCategories function to load more categories.
   */

  if (!dataLoading.value && dataHasMore.value && to === catalogueStore.categoriesList.length - 1) {
    fetchCategories();
  }
}

const inputValue = (val: string) => {
  /**
   * This function filters the categoriesList based on the input value.
   * It updates the categoriesList in the catalogueStore with the filtered list of categories.
   */

  topic.value = val
  if (!val) {
    dataPage.value = 0
    dataHasMore.value = true
    fetchCategories()
  } else {
    catalogueStore.categoriesList = []
    dataPage.value = 0
    dataHasMore.value = true
    fetchCategories()
  }
}

const updateQueryParams = () => {
  /**
   * This function updates the query parameters in the URL based on the changes on the categoriesSelected property
   * of the catalogueStore. If the categoriesSelected is empty, it removes the 'categories' query parameter from the URL.
   * When the categoriesSelected is not empty, it adds the 'categories' query parameter to the URL.
   */

  const queryParams = {...route.query}

  if (!!catalogueStore.categoriesSelected && catalogueStore.categoriesSelected.length > 0) {
    queryParams[`filter{category.identifier.in}`] = catalogueStore.categoriesSelected
  } else {
    delete queryParams[`filter{category.identifier.in}`]
  }

  router.replace({path: route.path, query: queryParams})
}

const initializeCategoriesFromQueryParams = async () => {
  /**
   * This function initializes the categoriesSelected property of the catalogueStore
   * based on the query parameters in the URL.
   * If the 'filter{category.identifier.in}' query parameter is present in the URL, it sets the categoriesSelected
   * property of the catalogueStore to the values in the query parameter.
   * It fetches the categories from the API if the categoriesSelected values are not present in the categoriesList.
   */

  const queryParamsCategories: LocationQueryValue | LocationQueryValue[] | undefined = route.query['filter{category.identifier.in}']

  if (queryParamsCategories) {
    catalogueStore.categoriesSelected = Array.isArray(queryParamsCategories) ? queryParamsCategories : [queryParamsCategories]

    while (!catalogueStore.categoriesSelected.every(selectedKey =>
        catalogueStore.categoriesList.some(category => category.key === selectedKey))) {
      await fetchCategories()
      if (!dataHasMore.value) break
    }
  }
}

onMounted(() => {
  if (!catalogueStore.hasPreviousRoute) {
    setTimeout(async () => {
      await initializeCategoriesFromQueryParams()
    }, 800)
  } else {
    catalogueStore.categoriesSelected = []
  }
})

watch(() => catalogueStore.showLeftDrawer, () => {
  if (catalogueStore.showLeftDrawer) {
    if (!catalogueStore.categoriesList.length) fetchCategories()
  }
})

</script>
