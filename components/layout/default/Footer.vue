<template>
  <q-footer bordered class="bg-white text-grey-9 q-py-xs q-px-sm">
    <div class="row justify-center q-gutter-lg">
      <!-- TODO: Add configurable and dynamic links to the footer -->
      <div class="col-auto">
        <NuxtLink href="https://geonode.org" target="_blank" style="text-decoration: none;">geonode.org</NuxtLink>
      </div>
      <div class="col-auto">
        <NuxtLink href="https://stable.demo.geonode.org/developer/" target="_blank" style="text-decoration: none;">Developers</NuxtLink>
      </div>
      <div class="col-auto">
        <NuxtLink to="/about" style="text-decoration: none;">About</NuxtLink>
      </div>
      <!-- /TODO: Add configurable and dynamic links to the footer -->
    </div>
  </q-footer>
</template>
