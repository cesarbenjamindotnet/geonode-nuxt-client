<template>
  <q-menu  v-model="showMenu" anchor="bottom left" self="top left" @hide="emitHide">
    <q-list dense>
      <q-item clickable>
        <q-item-section side style="padding-right: 2px;">
          <q-icon name="keyboard_arrow_left"/>
        </q-item-section>
        <q-item-section>Language</q-item-section>
        <q-menu anchor="top end" self="top start">
          <q-list dense>
            <q-item clickable v-close-popup @click="menuAction('Logout')">
              <q-item-section class="q-px-sm">English</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="menuAction('Logout')">
              <q-item-section class="q-px-sm">Español</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="menuAction('Logout')">
              <q-item-section class="q-px-sm">Français</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="menuAction('Logout')">
              <q-item-section class="q-px-sm">Italiano</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-item>
      <q-separator />
      <q-item clickable v-close-popup @click="menuAction('Settings')">
        <q-item-section class="q-px-sm">Persons</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="menuAction('Help')">
        <q-item-section class="q-px-sm">Groups</q-item-section>
      </q-item>
      <q-separator/>
      <q-item clickable v-close-popup @click="menuAction('Logout')">
        <q-item-section class="q-px-sm">Invite User</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="menuAction('Logout')">
        <q-item-section class="q-px-sm">Add User</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="menuAction('Logout')">
        <q-item-section class="q-px-sm">Create Group</q-item-section>
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

<style lang="scss" scoped>
.submenu-arrow-left {
  padding-right: 2px;
}
</style>