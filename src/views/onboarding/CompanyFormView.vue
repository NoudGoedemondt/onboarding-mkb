<template>
  <v-container v-if="user">
    <v-card class="pa-5 mx-auto" max-width="600">
      <v-card-text>
        <v-form ref="formRef" v-model="valid" lazy-validation>
          <v-text-field
            v-model="company.name"
            label="Bedrijfsnaam"
            :rules="[required]"
            :loading="loading"
            :disabled="loading"
            required
          />
          <v-text-field
            v-model="company.address"
            label="Adres"
            :rules="[required]"
            :loading="loading"
            :disabled="loading"
            required
          />
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="company.zip"
                label="Postcode"
                :rules="[required, validZip]"
                :loading="loading"
                :disabled="loading"
                required
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="company.city"
                label="Plaats"
                :rules="[required]"
                :loading="loading"
                :disabled="loading"
                required
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>

  <v-container v-else> Geen gebruiker gevonden. Log in. </v-container>
</template>

<script setup>
import { ref, defineExpose, defineEmits, onMounted } from 'vue';
import { auth, db } from '@/firebase';
import { ref as dbRef, set, get } from 'firebase/database';

const emit = defineEmits(['notify']);

const user = auth.currentUser;

const valid = ref(false);
const formRef = ref(null);
const loading = ref(true);

const company = ref({
  name: '',
  address: '',
  zip: '',
  city: '',
});

const required = (v) => !!v || 'Dit veld is verplicht';
const validZip = (v) =>
  /^[1-9][0-9]{3}\s?[a-zA-Z]{2}$/.test(v) || 'Ongeldige postcode';

const submit = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid?.valid || !user) return false;

  try {
    const companyRef = dbRef(db, `companies/${user.uid}`);
    await set(companyRef, company.value);
    emit('notify', 'Bedrijfsgegevens succesvol opgeslagen!');
    return true;
  } catch (e) {
    console.error('Fout bij opslaan:', e);
    emit('notify', 'Fout bij opslaan bedrijfsgegevens', e.message);
    return false;
  }
};

onMounted(() => {
  if (user) {
    const companyRef = dbRef(db, `companies/${user.uid}`);
    get(companyRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          company.value = snapshot.val();
        }
      })
      .catch((error) => {
        console.error('Fout bij ophalen bedrijfsgegevens:', error.message);
      })
      .finally(() => {
        loading.value = false;
      });
  }
});
defineExpose({ submit });
</script>
