<template>
  <div>
    <!-- Mensaje para el usuario mientras se maneja el callback -->
    <p>Procesando la autenticación...</p>
  </div>
</template>

<script setup>
import { useAuth } from '@sidebase/nuxt-auth';

const { handleCallback } = useAuth();

// Maneja el callback
handleCallback().then(() => {
  // Redirige al usuario a la página principal o a la página deseada después del login
  window.location.href = '/';
}).catch(error => {
  // Maneja errores si el callback falla
  console.error('Error en el callback:', error);
});
</script>
