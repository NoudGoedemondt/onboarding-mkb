<template>
  <v-container>
    <v-card class="pa-5 mx-auto" max-width="600">
      <profile-section @notify="showSnackbar" />

      <br />

      <!-- <company-section @notify="showSnackbar" /> -->

      <br />

      <delete-account @notify="showSnackbar" />

      <!-- TODO: feature toevoegen voor wijzigen van email en wachtwoord -->
    </v-card>
  </v-container>

  <v-snackbar v-model="snackbar" :timeout="3000" location="bottom center">
    {{ snackbarText }}
  </v-snackbar>
</template>

<script setup>
import ProfileSection from '@/components/profile/ProfileSection.vue';
// import CompanySection from '@/components/profile/CompanySection.vue';
import DeleteAccount from '@/components/profile/DeleteAccount.vue';

import { ref } from 'vue';

const snackbar = ref(false);
const snackbarText = ref('');

const showSnackbar = (message) => {
  snackbarText.value = message;
  snackbar.value = true;
};
</script>
