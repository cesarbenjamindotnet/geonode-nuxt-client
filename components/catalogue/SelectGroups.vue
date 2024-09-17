<template>
  <div class="row">
    <b>Group</b>
  </div>
  <div class="row q-pb-md" style="margin-top: 4px;">
    <q-select outlined dense v-model="catalogueStore.groupsSelected"
              :options="catalogueStore.groupsList" label="Select groups"
              use-chips clearable
              option-value="key"
              :option-label="(item) => item.label + ' (' + item.count + ')'"
              emit-value
              map-options
              @clear="catalogueStore.groupsSelected = []"
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

const fetchGroups = async () => {
  /**
   * This function fetches groups from the API and adds them to the groupsList array in the catalogueStore.
   * It updates the groupsPage value to fetch the next page of groups.
   * If there are no more groups to fetch, it sets the groupsHasMore value to false.
   */

  if (dataLoading.value || !dataHasMore.value) return
  dataLoading.value = true
  const topicQuery = topic.value ? `&topic_contains=${topic.value}` : ''
  const url = `https://development.demo.geonode.org/api/v2/facets/group?page=${dataPage.value}&page_size=${dataPageSize}${topicQuery}`

  let headers = {}
  if (authStore.isAuthenticated) {
    // headers = {Authorization: `Bearer ${authStore.token.access_token}`}
    // TODO: implementar esto cuando tenga mejor armado el backend
  }

  try {
    const {data} = await useFetch<FacetsResponse>(url, {headers: headers})
    const {topics: {items = []} = {}} = data.value || {}
    if (items.length) {
      catalogueStore.groupsList.push(...items.filter(item => !catalogueStore.groupsList.some(group => group.key === item.key)))
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
   * It checks if the user has reached the end of the list of groups and
   * calls the fetchGroups function to load more groups.
   */

  if (!dataLoading.value && dataHasMore.value && to === catalogueStore.groupsList.length - 1) {
    fetchGroups();
  }
}

const inputValue = (val: string) => {
  /**
   * This function filters the groupsList based on the input value.
   * It updates the groupsList in the catalogueStore with the filtered list of groups.
   */

  topic.value = val
  if (!val) {
    dataPage.value = 0
    dataHasMore.value = true
    fetchGroups()
  } else {
    catalogueStore.groupsList = []
    dataPage.value = 0
    dataHasMore.value = true
    fetchGroups()
  }
}

const updateQueryParams = () => {
  /**
   * This function updates the query parameters in the URL based on the changes on the groupsSelected property
   * of the catalogueStore. If the groupsSelected is empty, it removes the 'groups' query parameter from the URL.
   * When the groupsSelected is not empty, it adds the 'groups' query parameter to the URL.
   */

  const queryParams = {...route.query}

  if (!!catalogueStore.groupsSelected && catalogueStore.groupsSelected.length > 0) {
    queryParams[`filter{group.in}`] = catalogueStore.groupsSelected.map(String)
  } else {
    delete queryParams[`filter{group.in}`]
  }

  router.replace({path: route.path, query: queryParams})
}

const initializeGroupsFromQueryParams = async () => {
  /**
   * This function initializes the groupsSelected property of the catalogueStore
   * based on the query parameters in the URL.
   * If the 'filter{group.in}' query parameter is present in the URL, it sets the groupsSelected
   * property of the catalogueStore to the values in the query parameter.
   * It fetches the groups from the API if the groupsSelected values are not present in the groupsList.
   */

  const queryParamsGroups: LocationQueryValue | LocationQueryValue[] | undefined = route.query['filter{group.in}']

  if (queryParamsGroups) {
    catalogueStore.groupsSelected = Array.isArray(queryParamsGroups) ? queryParamsGroups.map(Number) : [Number(queryParamsGroups)]

    console.log('groupsSelected:', catalogueStore.groupsSelected)

    while (!catalogueStore.groupsSelected.every(selectedKey =>
        catalogueStore.groupsList.some(category =>  category.key === selectedKey))) {
      await fetchGroups()
      if (!dataHasMore.value) break
    }
  }
}

onMounted(() => {
  if (!catalogueStore.hasPreviousRoute) {
    setTimeout(async () => {
      await initializeGroupsFromQueryParams()
    }, 800)
  } else {
    catalogueStore.groupsSelected = []
  }
})

watch(() => catalogueStore.showLeftDrawer, () => {
  if (catalogueStore.showLeftDrawer) {
    if (!catalogueStore.groupsList.length) fetchGroups()
  }
})

</script>
