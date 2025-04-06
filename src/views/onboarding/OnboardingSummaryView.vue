<template>
  <v-container v-if="user">
    <v-card class="pa-5 mx-auto" max-width="800">
      <v-card-title class="text-h5">Samenvatting</v-card-title>
      <v-card-text>
        <v-skeleton-loader v-if="loading" type="card" />
        <template v-else>
          <!-- Bedrijfsgegevens -->
          <v-subheader>Bedrijfsinformatie</v-subheader>
          <v-divider class="mb-3" />
          <p><strong>Naam:</strong> {{ company.name }}</p>
          <p><strong>Adres:</strong> {{ company.address }}</p>
          <p><strong>Postcode:</strong> {{ company.zip }}</p>
          <p><strong>Plaats:</strong> {{ company.city }}</p>

          <!-- Logo -->
          <v-subheader class="mt-5">Logo</v-subheader>
          <v-divider class="mb-3" />
          <div v-if="logo">
            <img :src="logo" alt="Logo preview" style="max-height: 120px" />
          </div>
          <div v-else>
            <em>Geen logo geüpload.</em>
          </div>

          <!-- Workflowvragen -->
          <v-subheader class="mt-5">Workflowvragen</v-subheader>
          <v-divider class="mb-3" />
          <div v-if="workflow && Object.keys(workflow).length">
            <div v-for="(value, key) in workflow" :key="key" class="mb-2">
              <strong>{{ formatKey(key) }}:</strong> {{ value }}
            </div>
          </div>
          <div v-else>
            <em>Geen workflowvragen ingevuld.</em>
          </div>
        </template>
      </v-card-text>
    </v-card>
  </v-container>

  <v-container v-else>Geen gebruiker gevonden. Log in.</v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { auth, db } from '@/firebase';
import { ref as dbRef, get } from 'firebase/database';

const user = auth.currentUser;
const loading = ref(true);

const company = ref({});
const logo = ref('');
const workflow = ref({});

const formatKey = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

onMounted(async () => {
  if (!user) return;

  try {
    const [companySnap, logoSnap, workflowSnap] = await Promise.all([
      get(dbRef(db, `companies/${user.uid}`)),
      get(dbRef(db, `logos/${user.uid}`)),
      get(dbRef(db, `workflow/${user.uid}`)),
    ]);

    if (companySnap.exists()) company.value = companySnap.val();
    if (logoSnap.exists()) logo.value = logoSnap.val().base64;
    if (workflowSnap.exists()) workflow.value = workflowSnap.val();
  } catch (e) {
    console.error('Fout bij ophalen samenvattingsdata:', e);
  } finally {
    loading.value = false;
  }
});
</script>
