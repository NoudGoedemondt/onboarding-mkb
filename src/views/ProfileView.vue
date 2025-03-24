<template>
  <v-container>
    <profile-card @notify="showSnackbar" />
    <company-card @notify="showSnackbar" />
  </v-container>

  <v-snackbar v-model="snackbar" :timeout="3000" location="bottom center">
    {{ snackbarText }}
  </v-snackbar>
</template>

<script setup>
import ProfileCard from '@/components/profile/ProfileCard.vue';
import CompanyCard from '@/components/profile/CompanyCard.vue';

import { ref } from 'vue';

const snackbar = ref(false);
const snackbarText = ref('');

const showSnackbar = (message) => {
  snackbarText.value = message;
  snackbar.value = true;
};
</script>
