<template>
  <q-menu v-model="internalShowMenu" anchor="bottom left" self="top left" @hide="emitClose">
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
const internalShowMenu = computed({
  get: () => props.showMenu,
  set: (val) => emit('update:showMenu', val)
})

const props = defineProps({
  showMenu: Boolean
})

const emit = defineEmits(['update:showMenu', 'close-menu'])

const menuAction = (action: string) => {
  console.log(action)
}

const emitClose = () => {
  emit('update:showMenu', false)
  emit('close-menu')
  console.log('emitClose')
}

</script>

<style scoped>

</style>