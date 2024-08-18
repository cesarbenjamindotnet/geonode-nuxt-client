<template>
  <q-menu v-model="showMenu" anchor="bottom left" self="top left" @hide="emitHide">
    <q-list>
      <q-item clickable v-close-popup @click="menuAction('Settings')">
        <q-item-section class="q-px-md">Español</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="menuAction('Help')">
        <q-item-section>Deutsch</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="menuAction('Logout')">
        <q-item-section>Français</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="menuAction('Logout')">
        <q-item-section>Italiano</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script setup lang="ts">
const props = defineProps({
  show: Boolean
})
const emit = defineEmits(['hide'])

const showMenu = computed({
  get: () => props.show,
  set: (val) => {
    if (!val) {
      emit('hide')
    }
  }
})

const menuAction = (action: string) => {
  console.log(action)
}

const emitHide = () => {
  console.log('emitHide')
  emit('hide')
}
</script>

<style scoped>

</style>