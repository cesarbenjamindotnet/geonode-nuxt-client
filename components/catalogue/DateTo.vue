<template>
  <div class="row">
    <!-- TODO: implement i18n for label -->
    <b>Date to</b>
  </div>
  <div class="row" style="margin-top: 4px;">
    <!-- TODO: implement i18n for placeholder -->
    <q-input outlined dense placeholder="Date to" class="full-width" clearable
             v-model="catalogueStore.filterInputDateTo"
             :rules="[validateDate]"
             mask="####-##-##"
             @click="openDatePopup"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="popupProxy" cover transition-show="scale" transition-hide="scale" >
            <q-date v-model="catalogueStore.filterInputDateTo" mask="YYYY-MM-DD">
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

  if (catalogueStore.filterInputDateTo) {
    queryParams[`filter{date.lte}`] = catalogueStore.filterInputDateTo
  } else {
    delete queryParams[`filter{date.lte}`]
  }

  router.push({query: queryParams})
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

// Watch for changes on the filterInputSearch property of the catalogueStore,
// When the filterInputSearch property changes, it calls the updateQueryParams function
watch(
    [() => catalogueStore.filterInputDateTo],
    () => updateQueryParams()
)

</script>

<style lang="scss" scoped>
:deep(.q-field__bottom) {
  padding: 2px 14px 0 !important;
}
</style>