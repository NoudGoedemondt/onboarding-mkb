<template>
  <v-app>
    <the-header />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import TheHeader from '@/components/ui/header/TheHeader.vue';
</script>
