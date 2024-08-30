<template>
<h1>Home</h1>
  <p>You are currently {{ status }}</p>
  <p>Token: {{ authStore.token }}</p>
  <p>User: {{ authStore.user }}</p>
</template>

<script setup lang="ts">
const { status } = useAuth()
const authStore = useAuthStore()
</script>

<style scoped>

</style>