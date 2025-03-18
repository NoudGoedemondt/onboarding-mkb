<template>
  <v-container v-if="user">
    <v-card class="pa-5 mx-auto" max-width="600">
      <v-card-title class="text-h5">Bedrijfsgegevens</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <!-- Bedrijfsnaam -->
          <v-text-field
            v-model="company.name"
            label="Bedrijfsnaam"
            :rules="[required]"
            required
          ></v-text-field>

          <!-- Adres -->
          <v-text-field
            v-model="company.address"
            label="Adres"
            :rules="[required]"
            required
          ></v-text-field>

          <!-- Postcode & Plaats -->
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="company.zip"
                label="Postcode"
                :rules="[required, validZip]"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="company.city"
                label="Plaats"
                :rules="[required]"
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Aantal medewerkers -->
          <v-radio-group v-model="company.employees" label="Aantal medewerkers">
            <v-radio label="1 tot 5 medewerkers" value="1-5"></v-radio>
            <v-radio label="6 tot 10 medewerkers" value="6-10"></v-radio>
            <v-radio label="11 tot 25 medewerkers" value="11-25"></v-radio>
            <v-radio label="Meer dan 25 medewerkers" value="25+"></v-radio>
          </v-radio-group>
        </v-form>
      </v-card-text>

      <v-card-actions class="d-flex justify-end">
        <v-btn color="primary" :disabled="!valid" @click="submitForm">
          Opslaan
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
  <v-container v-else>
    <v-progress-circular color="purple" indeterminate></v-progress-circular>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { auth, db } from '@/firebase';
import { ref as dbRef, set, get } from 'firebase/database';
import { useRouter } from 'vue-router';

const router = useRouter();

const user = ref(null);
const companyExists = ref(false);

const valid = ref(false);
const company = ref({
  name: '',
  address: '',
  zip: '',
  city: '',
  employees: '',
});

const required = (v) => !!v || 'Dit veld is verplicht';
const validZip = (v) =>
  /^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/.test(v) || 'Ongeldige postcode';

const submitForm = async () => {
  if (!valid.value) return;

  if (!user.value) {
    alert('Je moet ingelogd zijn om dit te kunnen doen!');
    return;
  }

  const companyData = {
    name: company.value.name,
    address: company.value.address,
    zip: company.value.zip,
    city: company.value.city,
    employees: company.value.employees,
    owner: user.value.uid, // Koppel het bedrijf aan de gebruiker
    createdAt: new Date().toISOString(),
  };

  try {
    console.log(user.value.uid);
    const companyRef = dbRef(db, `companies/${user.value.uid}`);
    await set(companyRef, companyData);
    console.log('Bedrijf opgeslagen:', companyData);

    router.push('/');
  } catch (error) {
    console.error('Fout bij opslaan bedrijfsgegevens:', error);
    alert('Er is een fout opgetreden bij het opslaan van de bedrijfsgegevens.');
  }
};

onMounted(async () => {
  auth.onAuthStateChanged(async (firebaseUser) => {
    user.value = firebaseUser;

    if (!user.value) {
      router.push('/login');
      return;
    }

    const companyRef = dbRef(db, `companies/${user.value.uid}`);
    const snapshot = await get(companyRef);

    if (snapshot.exists()) {
      companyExists.value = true;
      router.push('/');
    }
  });
});
</script>
