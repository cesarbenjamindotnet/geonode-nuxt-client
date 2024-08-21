<template>
<h1>Home</h1>
  <p>You are currently {{ status }}</p>
</template>

<script setup lang="ts">
const { status } = useAuth()
</script>

<style scoped>

</style>