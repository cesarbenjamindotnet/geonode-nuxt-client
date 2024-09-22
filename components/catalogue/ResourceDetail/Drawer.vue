<template>
  <q-drawer
      v-if="catalogueStore.resourceSelected"
      v-model="catalogueStore.showResourceDetailDrawer"
      side="right"
      bordered
      :width="rightDrawerWidth"
      behavior="desktop"
  >
    <q-toolbar>
      <span class="text-grey-9 q-pr-sm"><q-icon
          :name="getResourceTypeIcon(catalogueStore.resourceSelected.resource_type)" size="20px"
          style="top: -1.5px"/></span>
      <span class="text-grey-9 " style="font-size: 18px;">{{ catalogueStore.resourceSelected.title }}</span>
      <q-space/>
      <q-btn flat dense size="md" icon="close" @click="catalogueStore.showResourceDetailDrawer = false"/>
    </q-toolbar>
    <q-separator color="grey-2"/>
    <div class="bg-yellow-2 text-center content-center align-center full-width" style="min-height: 300px;">
      <p>{{ catalogueStore.resourceSelected.title }}</p>
    </div>
    <q-separator color="grey-2"/>

    <q-toolbar>
          <span class="text-grey-9 q-pr-sm"><q-icon
              :name="getResourceTypeIcon(catalogueStore.resourceSelected.resource_type)" size="20px"
              style="top: -1.5px"/></span>
      <span class="text-grey-9 ellipsis" style="font-size: 18px;">{{ catalogueStore.resourceSelected.title }}</span>
      <q-space/>

      <q-btn flat dense size="sm" class="q-pa-sm" icon="mdi-download"
             @click="catalogueStore.showResourceDetailDrawer = false"/>
      <q-btn flat dense size="sm" class="q-pa-sm" icon="mdi-share"
             @click="catalogueStore.showResourceDetailDrawer = false"/>
      <q-btn flat dense size="sm" class="q-pa-sm" icon="mdi-earth"
             @click="catalogueStore.showResourceDetailDrawer = false"/>
      <div class="q-pl-xs">
        <q-btn dense size="md" @click="catalogueStore.showResourceDetailDrawer = false" no-caps color="primary"
               class="q-px-sm"> Download
        </q-btn>
      </div>


    </q-toolbar>

    <div class="row q-pb-md q-px-md">

      <div class="col-auto full-width" v-if="resourceData">
        <p>a dataset from
          <NuxtLink to="/catalogue" style="text-decoration: none" v-if="resourceData && resourceData.owner">
            {{ resourceData.owner.username }}
          </NuxtLink>
          / {{ formattedDate }}
        </p>

        <q-tabs
            v-model="tab"
            no-caps
            dense
            align="left"
            class="bg-primary text-white shadow-2"
            :breakpoint="0"
        >
          <q-tab name="info">Info</q-tab>
          <q-tab name="location">Location</q-tab>
          <q-tab name="attributes">Attributes</q-tab>
          <q-tab name="linked-resources">linked resources</q-tab>
          <q-tab name="assets">Assets</q-tab>
        </q-tabs>
        <q-separator/>
        <q-tab-panels v-model="tab" animated class="q-pa-none">

          <q-tab-panel name="info" class="q-px-none">
            <CatalogueResourceDetailInfo :resourceData="resourceData"/>
          </q-tab-panel>
          <q-tab-panel name="location">
            <div class="text-h6">location</div>
            location Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
          <q-tab-panel name="attributes">
            <div class="text-h6">attributes</div>
            attributes Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
          <q-tab-panel name="linked-resources">
            <div class="text-h6">linked resources</div>
            linked Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
          <q-tab-panel name="assets">
            <div class="text-h6">assets</div>
            assets Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>

        </q-tab-panels>


        <p>kk</p>
        <p>{{ resourceData }}</p>
      </div>
    </div>
  </q-drawer>

</template>


<script setup lang="ts">
import { date } from 'quasar'
const catalogueStore = useCatalogueStore()
const $q = useQuasar()

const resourceData = ref({})
const tab = ref('info')

const rightDrawerWidth = computed(() => {
  if ($q.screen.width < 540 && $q.screen.width >= 300) {
    return 300
  } else if ($q.screen.width < 300) {
    return $q.screen.width
  } else {
    return 540
  }
})

//TODO: Convertir a un composable
const getResourceTypeIcon = (resource_type: string) => {
  if (resource_type === 'dataset') return 'mdi-database';
  if (resource_type === 'map') return 'mdi-map';
  if (resource_type === 'document') return 'mdi-file-document-outline';
  if (resource_type === 'geostory') return 'mdi-book-open-variant';
  if (resource_type === 'dashboard') return 'mdi-view-dashboard';
  return 'mdi-file-outline';
}

const getResourceDetailData = async (pk: string) => {
  console.log("getResourceDetailData", pk)
  const response = await useFetch<any>(`https://development.demo.geonode.org/api/v2/resources/${pk}?api_preset=viewer_common`)
  if (response.data.value && response.data.value.resource) {
    resourceData.value = response.data.value.resource
    console.log("resourceData", resourceData.value)
  }
}

const formattedDate = computed(() => {
  if (resourceData.value && resourceData.value.date) {
    return date.formatDate(resourceData.value.date, 'MMMM Do, YYYY');
  }
  return '';
});

onMounted(async () => {
  console.log("onMounted catalogueStore.resourceSelected", catalogueStore.resourceSelected)
  if (catalogueStore.resourceSelected) {
    await getResourceDetailData(catalogueStore.resourceSelected.pk)
  }
})

watch(() => catalogueStore.resourceSelected, async (newValue) => {
  console.log("watch catalogueStore.resourceSelected", newValue)
  if (newValue) {
    await getResourceDetailData(newValue.pk)
  }
})

</script>

<style scoped>

</style>