<template>
  <div>
    <q-layout view="hHh lpr fff">

      <q-drawer v-model="leftDrawerOpen" side="left" bordered behavior="desktop">
        <!-- drawer content -->
        <div class="row q-px-sm q-py-xs">
          <div class="col-auto content-center">
            <span class="text-grey-9"><q-icon name="mdi-filter"/>Filters</span>
          </div>
          <q-space/>
          <div class="col-auto content-center">
            <q-btn flat dense @click="toggleLeftDrawer" no-caps class="q-px-sm" text-color="grey-8">Clear
              filters
            </q-btn>
            <q-btn flat round dense icon="close" @click="toggleLeftDrawer"/>
          </div>
        </div>
        <q-separator color="grey-2"/>
        <div class="row q-pa-md">
          <div class="col-12 q-gutter-md">
            <div class="row">
              <q-input outlined dense v-model="search" placeholder="Search" class="full-width"/>
            </div>
            <div class="row">
              <b>Resources</b>
            </div>
            <div class="row" style="margin-top: 0">
              <q-tree
                  :nodes="resource_tree_nodes"
                  v-model:ticked="ticked"
                  node-key="label"
                  tick-strategy="leaf"
                  default-expand-all
                  no-connectors
                  no
              />
            </div>
            <div class="row">
              <b>Category</b>
            </div>
            <div class="row" style="margin-top: 4px;">
              <q-select model-value="all" outlined class="full-width" :options="resource_types" label="Resource type"
                        dense/>
            </div>
            <div class="row">
              <b>Keyword</b>
            </div>
            <div class="row" style="margin-top: 4px;">
              <q-select model-value="all" outlined class="full-width" :options="resource_types" label="Resource type"
                        dense/>
            </div>
            <div class="row">
              <b>Region</b>
            </div>
            <div class="row" style="margin-top: 4px;">
              <q-select model-value="all" outlined class="full-width" :options="resource_types" label="Resource type"
                        dense/>
            </div>
            <div class="row">
              <b>Owner</b>
            </div>
            <div class="row" style="margin-top: 4px;">
              <q-select model-value="all" outlined class="full-width" :options="resource_types" label="Resource type"
                        dense/>
            </div>
            <div class="row">
              <b>Group</b>
            </div>
            <div class="row" style="margin-top: 4px;">
              <q-select model-value="all" outlined class="full-width" :options="resource_types" label="Resource type"
                        dense/>
            </div>
            <div class="row">
              <b>Extent</b>
            </div>
            <div class="row" style="margin-top: 4px;">
              <q-select model-value="all" outlined class="full-width" :options="resource_types" label="Resource type"
                        dense/>
            </div>

          </div>
        </div>
      </q-drawer>

      <q-page-container>
        <q-toolbar class="sticky">
          <div class="col q-gutter-sm">
            <q-btn dense @click="toggleLeftDrawer" no-caps color="primary" class="q-px-md">Filter
              <q-badge :color="filter.length ? 'green' : 'grey-7'" rounded floating label="199"/>
            </q-btn>
            <q-btn dense no-caps class="q-px-md" color="grey-7">Order by</q-btn>
          </div>


          <q-space/>
          <q-btn dense flat round :icon="viewMode == 'grid' ? 'mdi-view-grid' : 'mdi-view-list'"
                 @click="toggleViewMode"/>

        </q-toolbar>
        <q-separator/>
        <q-page padding>

        </q-page>
      </q-page-container>

    </q-layout>
  </div>
</template>

<script setup lang="ts">

const route = useRoute()

const leftDrawerOpen = ref(false)

const filter = ref([1])
const viewMode = ref("grid")

const resource_types = [
  {value: "all", label: "All"},
  {value: "dataset", label: "Datasets"},
  {value: "map", label: "Maps"},
  {value: "document", label: "documents"},
  {value: "geostory", label: "Geostories"},
  {value: "dashboard", label: "Dashboards"},
]

const resource_tree_nodes = [
  {value: 'featured', label: 'Featured'},
  {
    value: 'datasets', label: 'Datasets', children: [
      {value: 'vector', label: 'Vector'},
      {value: 'raster', label: 'Raster'},
      {value: 'remote', label: 'Remote'},
      {value: 'timeseries', label: 'Time series'},
      {value: 'tabular', label: 'Tabular'},
    ]
  },
  {value: 'maps', label: 'Maps'},
  {value: 'mapviewers', label: 'Maps Viewers'},
  {value: 'documents', label: 'Documents'},
  {value: 'geostories', label: 'GeoStories'},
  {value: 'dashboards', label: 'dashboards'},
]

const ticked = ref(["all"])

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === "grid" ? "list" : "grid"
}
</script>

<style scoped>

</style>