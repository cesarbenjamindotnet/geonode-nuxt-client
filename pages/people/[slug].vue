<template>
  <div>
    Current path: {{ route.fullPath }}
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
</script>