<template>
  <q-page class="q-pa-md ">

    <div class="row q-gutter-md">
      <!-- Panel izquierdo -->
      <div class="col-md-3">
        <q-card class="q-pa-md">
          <q-btn
              icon="add"
              label="Seleccionar archivos..."
              color="primary"
              class="full-width q-mb-sm"
              @click="fileInputRef.click()"
          />
          <q-btn
              icon="link"
              label="obtener archivo desde URL"
              color="primary"
              class="full-width q-mb-md"
              flat
              disable
          />
          <input
              ref="fileInputRef"
              type="file"
              multiple
              class="hidden"
              @change="handleFiles"
          />
          <div class="q-mb-md">
            <div v-for="(file, index) in files" :key="index" class="q-py-sm row items-center justify-between">
              <div class="col">
                <div><span v-text="file.name.split('.')[0]"></span></div>
                <q-chip size="sm" color="grey-4" text-color="black" :label="'.'+file.name.split('.').pop()"/>
              </div>
              <div class="col text-right">
                <div class="text-caption">{{ formatSize(file.size) }}</div>
                <q-btn icon="delete" flat round dense @click="removeFile(index)"/>
              </div>
            </div>
          </div>
          <q-btn
              label="Subir"
              color="primary"
              class="full-width"
              :disable="files.length === 0"
              @click="uploadFiles"
          />
        </q-card>
      </div>

      <!-- Panel derecho -->
      <div class="col">
        <q-input
            filled
            debounce="300"
            v-model="search"
            label="Filtrar cargas pendientes por nombre..."
            class="q-mb-md"
        />
        <q-card
            v-for="(item, index) in filteredPending"
            :key="index"
            class="q-pa-md q-mb-sm"
        >
          <div class="row items-center justify-between">
            <div>
              <q-icon name="hourglass_empty" class="q-mr-sm"/>
              <span class="text-primary text-weight-medium cursor-pointer">{{ item.filename }}</span>
              <div class="text-caption text-grey">execution_id: {{ item.execution_id }}</div>
            </div>
            <div class="row items-center">
              <q-btn icon="delete" flat round class="q-mr-sm"/>
              <q-btn label="Ver" color="primary"/>
            </div>
          </div>
        </q-card>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import {ref, computed} from 'vue'

const fileInputRef = ref(null)
const files = ref([])
const pendingUploads = ref([])
const search = ref('')

function handleFiles(e) {
  const selected = Array.from(e.target.files)
  files.value.push(...selected)
}

function removeFile(index) {
  files.value.splice(index, 1)
}

function formatSize(size) {
  return Math.round(size / 1024) + ' KB'
}

function uploadFiles() {
  files.value.forEach(file => {
    // Simulación de POST
    simulateUpload(file).then(execution_id => {
      pendingUploads.value.push({
        filename: file.name,
        execution_id,
        created: new Date()
      })
    })
  })
  files.value = []
}

// Simula un POST
function simulateUpload(file) {
  return new Promise(resolve => {
    setTimeout(() => {
      const id = 'exec_' + Math.random().toString(36).substring(2, 10)
      resolve(id)
    }, 1000)
  })
}

const filteredPending = computed(() => {
  if (!search.value) return pendingUploads.value
  return pendingUploads.value.filter(item =>
      item.filename.toLowerCase().includes(search.value.toLowerCase())
  )
})
</script>

<style scoped>
.hidden {
  display: none;
}
</style>
