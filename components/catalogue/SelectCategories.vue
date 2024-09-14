<template>
  <div class="row">
    <b>Category</b>
  </div>
  <div class="row q-pb-md" style="margin-top: 4px;">
    <p>{{ catalogueStore.categoriesSelected }}</p>
    <q-select outlined dense v-model="catalogueStore.categoriesSelected"
              :options="catalogueStore.categoriesList" label="Select categories"
              use-chips clearable
              option-value="key"
              :option-label="(item) => item.label + ' (' + item.count + ')'"
              emit-value
              map-options
              @clear="catalogueStore.categoriesSelected = []"
              @update:model-value="updateQueryParams"
              popup-no-route-dismiss
              multiple use-input class="full-width" @virtual-scroll="handleCategoriesScroll"
              :loading="categoriesLoading"/>
  </div>
</template>

<script setup lang="ts">
const catalogueStore = useCatalogueStore()

</script>
