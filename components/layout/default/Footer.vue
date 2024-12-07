<template>
  <q-footer bordered class="bg-white text-grey-9 q-py-xs q-px-sm">
    <div class="row justify-center q-gutter-lg">
      <div class="col-auto">
        <NuxtLink to="/developer" style="text-decoration: none;">Developers</NuxtLink>
      </div>
      <div class="col-auto">
        <NuxtLink to="/help" style="text-decoration: none;">Help</NuxtLink>
      </div>
      <div class="col-auto">
        <NuxtLink to="/about" style="text-decoration: none;">About</NuxtLink>
      </div>
      <!-- /TODO: Add configurable and dynamic links to the footer -->
    </div>
  </q-footer>
</template>
<script setup lang="ts">
</script>