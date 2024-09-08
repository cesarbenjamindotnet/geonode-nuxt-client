<template>
  <q-layout view="hhh lpr fff">

    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <q-toolbar class="sticky">
        <div class="col q-gutter-sm">
          <q-btn dense @click="toggleLeftDrawer" no-caps color="primary" class="q-px-md">Filter
            <q-badge :color="filter.length ? 'green' : 'grey-7'" rounded floating label="199"/>
          </q-btn>
          <q-btn dense no-caps class="q-px-md" color="grey-7">Order by</q-btn>
          <!-- <q-chip class="bg-white text-grey-7" style="margin-top: 12px;">X Resources found</q-chip> -->
        </div>


        <q-space/>
        <q-btn dense flat round :icon="viewMode == 'grid' ? 'mdi-view-grid' : 'mdi-view-list'" @click="toggleViewMode" />

      </q-toolbar>
      <q-separator/>
      <q-page padding>

      </q-page>
    </q-page-container>

  </q-layout>

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

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === "grid" ? "list" : "grid"
}
</script>

<style scoped>

</style>