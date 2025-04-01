<template>
  <v-container v-if="user">
    <v-card class="pa-5 mx-auto" max-width="600">
      <v-card-title class="text-h5">Bedrijfsgegevens</v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="company.name"
            label="Bedrijfsnaam"
            :rules="[required]"
            required
          />
          <v-text-field
            v-model="company.address"
            label="Adres"
            :rules="[required]"
            required
          />
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="company.zip"
                label="Postcode"
                :rules="[required, validZip]"
                required
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="company.city"
                label="Plaats"
                :rules="[required]"
                required
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="d-flex justify-end">
        <v-btn color="primary" :disabled="!valid" @click="submitForm">
          Opslaan
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar v-model="snackbar" :timeout="3000" :color="snackbarColor">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>

  <v-container v-else>
    <v-progress-circular color="purple" indeterminate />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { auth, db } from '@/firebase';
import { ref as dbRef, set, get } from 'firebase/database';
import { useRouter } from 'vue-router';

const router = useRouter();

const user = ref(null);
const valid = ref(false);

const company = ref({
  name: '',
  address: '',
  zip: '',
  city: '',
});

const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

const showSnackbar = (message, color = 'success') => {
  snackbarText.value = message;
  snackbarColor.value = color;
  snackbar.value = true;
};

const required = (v) => !!v || 'Dit veld is verplicht';
const validZip = (v) =>
  /^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/.test(v) || 'Ongeldige postcode';

const submitForm = async () => {
  if (!valid.value || !user.value) return;

  const companyData = { ...company.value };

  try {
    const companyRef = dbRef(db, `companies/${user.value.uid}`);
    await set(companyRef, companyData);
    showSnackbar('Bedrijf succesvol opgeslagen');
  } catch (error) {
    console.error('Fout bij opslaan bedrijfsgegevens:', error);
    showSnackbar('Fout bij opslaan bedrijfsgegevens', 'error');
  }
};

onMounted(() => {
  auth.onAuthStateChanged(async (firebaseUser) => {
    user.value = firebaseUser;

    if (!user.value) {
      router.push('/login');
      return;
    }

    const companyRef = dbRef(db, `companies/${user.value.uid}`);
    const snapshot = await get(companyRef);

    if (snapshot.exists()) {
      company.value = snapshot.val();
    }
  });
});
</script>
