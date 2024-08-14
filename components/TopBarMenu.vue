<template>
    <q-toolbar class="bg-purple text-white">
      <q-btn flat round dense icon="assignment_ind" />
      <q-toolbar-title>
        Toolbar
      </q-toolbar-title>
      <q-btn flat round dense icon="apps" class="q-mr-xs" />
      <q-btn flat round dense icon="more_vert" />
    </q-toolbar>
</template>

<script setup lang="ts">
const route = useRoute()
const leftLinks = [
  [{
    label: 'Installation',
    icon: 'i-heroicons-home',
    to: '/getting-started/installation'
  }, {
    label: 'Horizontal Navigation',
    icon: 'i-heroicons-chart-bar',
    to: `${route.path.startsWith('/dev') ? '/dev' : ''}/components/horizontal-navigation`
  }, {
    label: 'Command Palette',
    icon: 'i-heroicons-command-line',
    to: '/components/command-palette'
  }]
]

const rightLinks = [
  [{
    label: 'Examples',
    icon: 'i-heroicons-light-bulb'
  }, {
    label: 'Help',
    icon: 'i-heroicons-question-mark-circle'
  }],
  [{
    label: 'Registrarse',
  }, {
    label: 'Acceder',
    icon: 'i-heroicons-arrow-left-end-on-rectangle'
  }]
]
</script>

<style scoped>

</style>