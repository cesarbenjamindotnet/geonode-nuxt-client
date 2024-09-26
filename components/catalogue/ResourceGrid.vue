<template>
  <div class="row q-col-gutter-md justify-center q-pr-md" style="max-width: 1460px; margin: 0 auto;">
    <div
        v-for="(resource, index) in catalogueStore.resources"
        :key="index"
        :class="{
                'col-xs-12 col-sm-6 col-md-4 col-lg-3': !catalogueStore.showLeftDrawer && !catalogueStore.showResourceDetailDrawer,
                'col-xs-12 col-sm-12 col-md-6 col-lg-4': catalogueStore.showLeftDrawer || catalogueStore.showResourceDetailDrawer
              }"
    >
      <NuxtLink style="text-decoration:none; cursor: pointer" @click="showResourceInfo(resource)">
        <q-card class="q-card-flex hover-card">

          <div class="card-img-wrapper">
            <q-img
                v-if="resource.thumbnail_url"
                :src="resource.thumbnail_url"
                :alt="resource.title"
                class="card-img"
                basic
            >
              <div class="absolute-bottom text-subtitle2 ellipsis-title">
                <q-icon :name="getResourceTypeIcon(resource.resource_type)" size="20px"
                        style="top: -2px; padding-right: 4px;"/>
                {{ resource.title }}
              </div>
            </q-img>

            <q-img
                v-else
                class="card-img placeholder-img"
                :src="generatePlaceholderImage()"
                :alt="resource.title"
                basic
            >
              <div class="absolute-bottom text-subtitle2 ellipsis-title shadowed-text">
                <q-icon :name="getResourceTypeIcon(resource.resource_type)" size="20px"
                        style="top: -2px; padding-right: 4px;"/>
                {{ resource.title }}
              </div>
            </q-img>
          </div>

          <q-card-section class="q-card-description">
            <div class="ellipsis-description">
              <span v-if="resource.raw_abstract">{{ resource.raw_abstract }}</span>
              <span v-else>No description found</span>
            </div>
          </q-card-section>
          <q-card-actions>
            <q-btn flat dense no-caps color="primary" class="q-mr-auto" @click.stop="viewUser" style="cursor: context-menu">
              <q-avatar size="23px" style="padding-right: 12px;">
                <img :src="resource.owner.avatar" :alt="resource.owner.username">
              </q-avatar>
              <span class="q-px-sm">{{ resource.owner.username }}</span>
            </q-btn>
            <q-btn dense no-caps color="primary" class="q-ml-auto" @click.stop="viewResource"><span class="q-px-sm" style="cursor: context-menu">View</span></q-btn>
          </q-card-actions>
        </q-card>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const catalogueStore = useCatalogueStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const showResourceInfo = (resource: any) => {
  // console.log("showResourceInfo", resource)
  catalogueStore.resourceSelected = resource
  catalogueStore.showLeftDrawer = false
  catalogueStore.showResourceDetailDrawer = true
}

const viewUser = (resource: any) => {
  console.log("viewUser", resource)
}

const viewResource = (resource: any) => {
  console.log("viewResource", resource)
}

const generatePlaceholderImage = () => {
  // Define the canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const width = 500; // Width of the placeholder image
  const height = 200; // Height of the placeholder image

  // Set canvas dimensions
  canvas.width = width;
  canvas.height = height;

  // Draw the background color
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, width, height);

  // Draw placeholder text
  ctx.font = 'bold 24px Arial';
  ctx.fillStyle = '#1c83b1';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('No thumbnail', width / 2, height / 2);

  // Convert the canvas to a data URL
  return canvas.toDataURL('image/png');
}

//TODO: Convertir a un composable
const getResourceTypeIcon = (resource_type: string) => {
  if (resource_type === 'dataset') return 'mdi-database';
  if (resource_type === 'map') return 'mdi-map';
  if (resource_type === 'document') return 'mdi-file-document-outline';
  if (resource_type === 'geostory') return 'mdi-book-open-variant';
  if (resource_type === 'dashboard') return 'mdi-view-dashboard';
  return 'mdi-file-outline';
}

</script>

<style lang="scss" scoped>
.ellipsis-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%; /* Asegúrate de que el ancho esté limitado al contenedor */
}

.ellipsis-description {
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Limita a 3 líneas (ajusta según tu preferencia) */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.q-card-flex {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%; /* Esto hace que todas las tarjetas tengan la misma altura */
}

.q-card-description {
  flex-grow: 1; /* Hace que la sección de descripción ocupe el espacio disponible */
  display: flex;
  align-items: flex-start; /* Opcional: centra el contenido verticalmente */
  min-height: 80px; /* Asegura una altura mínima para la descripción */
}

.card-img-wrapper {
  height: 200px; /* Altura fija */
  position: relative;
  overflow: hidden; /* Ocultar desbordamiento */
}

.card-img {
  height: 100%;
  width: 100%;
  object-fit: cover; /* Mantiene la proporción de la imagen */
}

.card-img-placeholder {
  background-color: #f5f5f5; /* Fondo para el placeholder */
  display: flex;
  align-items: center;
  justify-content: center;
}

.hover-card {
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  border: 1px solid transparent;
}

.hover-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transform: scale(1.000);
  border-color: var(--primary);
}
</style>