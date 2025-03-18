<template>
  <v-sheet class="d-flex align-center justify-center h-50">
    <div>
      <div class="text-h5 font-weight-medium mb-3">
        Deze pagina kon niet worden gevonden...
      </div>
      <div>
        Ga terug naar
        <a
          style="cursor: pointer; text-decoration: underline"
          @click="route.push('/')"
          >de startpagina</a
        >
      </div>
    </div>
  </v-sheet>
</template>

<script setup>
import { useRouter } from 'vue-router';
const route = useRouter();
</script>
