<template>
  <div class="row">
    <!-- TODO: implement i18n for label -->
    <b>Date from</b>
  </div>
  <div class="row" style="margin-top: 4px;">
    <!-- TODO: implement i18n for placeholder -->
    <q-input outlined dense placeholder="Date from" class="full-width" clearable
             v-model="catalogueStore.filterInputDateFrom"
             :rules="[validateDate]"
             mask="####-##-##"
             @click="openDatePopup"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="popupProxy" cover transition-show="scale" transition-hide="scale" >
            <q-date v-model="catalogueStore.filterInputDateFrom" mask="YYYY-MM-DD">
              <div class="row items-center justify-end">
                <q-btn v-close-popup no-caps label="Close" color="primary" flat/>
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import type {LocationQueryValue} from "vue-router";

const catalogueStore = useCatalogueStore()
const router = useRouter()
const route = useRoute()

const popupProxy = ref(null);

const updateQueryParams = () => {
  /**
   * This function updates the query parameters in the URL based on the changes on the filterInputSearch property
   * of the catalogueStore. If the filterInputSearch is empty, it removes the 'q' query parameter from the URL.
   * When the filterInputSearch is not empty, it adds the 'q' query parameter to the URL.
   */

  const queryParams = {...route.query}

  if (catalogueStore.filterInputDateFrom) {
    queryParams[`filter{date.gte}`] = catalogueStore.filterInputDateFrom
  } else {
    delete queryParams[`filter{date.gte}`]
  }

  router.replace({path: route.path, query: queryParams})
}

const initializeDateFromFromQueryParams = () => {
  /**
   * This function initializes the filterInputDateFrom property of the catalogueStore with the value of the 'filter{date.gte}'
   * query parameter in the URL. If the 'filter{date.gte}' query parameter is not present, it sets the filterInputDateFrom
   * property to an empty string.
   */

  if (route.query['filter{date.gte}']) {
    catalogueStore.filterInputDateFrom = route.query['filter{date.gte}']?.toString()
  } else {
    catalogueStore.filterInputDateFrom = undefined
  }
}

const validateDate = (val) => {
  if (!val) {
    return true; // No hacer validación si no hay valor
  }

  // Verificar que la máscara se respete (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(val)) {
    // TODO: implement i18n for error message
    return 'The date format must be YYYY-MM-DD';
  }

  // Verificar si es una fecha válida
  const date = new Date(val);
  if (isNaN(date.getTime())) {
    // TODO: implement i18n for error message
    return 'Invalid date';
  }

  return true; // La fecha es válida
};

const openDatePopup = () => {
  /**
   * This function opens the date picker popup when input is clicked.
   */

  if (popupProxy.value) {
    popupProxy.value.show(); // Muestra el popup
  }
}

onMounted(() => {
  if (!catalogueStore.hasPreviousRoute) {
    setTimeout(async () => {
      await initializeDateFromFromQueryParams()
    }, 400)
  } else {
    catalogueStore.filterInputDateFrom = undefined
  }
})

// Watch for changes on the filterInputSearch property of the catalogueStore,
// When the filterInputSearch property changes, it calls the updateQueryParams function
watch(
    [() => catalogueStore.filterInputDateFrom],
    () => updateQueryParams()
)

</script>

<style lang="scss" scoped>
:deep(.q-field__bottom) {
  padding: 2px 14px 0 !important;
}
</style>