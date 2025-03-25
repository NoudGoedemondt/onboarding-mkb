<template>
  <v-card class="pa-5 mx-auto" max-width="600">
    <v-card-title> Bedrijfsgegevens </v-card-title>

    <v-card-text>
      <v-text-field
        label="Bedrijfsnaam"
        v-model="company.name"
        :disabled="!isEditing"
      ></v-text-field>

      <v-text-field
        label="Adres"
        v-model="company.address"
        :disabled="!isEditing"
      ></v-text-field>

      <v-row>
        <v-col>
          <v-text-field
            label="Postcode"
            v-model="company.zip"
            :disabled="!isEditing"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            label="Plaats"
            v-model="company.city"
            :disabled="!isEditing"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions class="d-flex justify-end">
      <v-btn color="primary" @click="toggleEdit">
        <v-icon left>{{ isEditing ? 'mdi-check' : 'mdi-pencil' }}</v-icon>
        {{ isEditing ? 'Opslaan' : 'Bewerken' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import { getAuth } from 'firebase/auth';
import { db } from '@/firebase';
import { ref as dbRef, onValue, set } from 'firebase/database';

const emit = defineEmits(['notify']);

const auth = getAuth();

const isEditing = ref(false);

const company = ref({
  name: '',
  address: '',
  zip: '',
  city: '',
});

const toggleEdit = async () => {
  if (isEditing.value) {
    await saveCompany();
  }
  isEditing.value = !isEditing.value;
};

const saveCompany = async () => {
  const user = getAuth().currentUser;
  const companyRef = dbRef(db, `companies/${user.uid}`);
  try {
    await set(companyRef, company.value);
    emit('notify', 'Bedrijfsgegevens opgeslagen');
  } catch (err) {
    emit('notify', 'Fout bij opslaan bedrijf', err.message);
  }
};

onMounted(() => {
  const user = auth.currentUser;
  if (!user) return;

  const companyRef = dbRef(db, `companies/${user.uid}`);
  onValue(companyRef, (snapshot) => {
    if (snapshot.exists()) {
      company.value = snapshot.val();
    }
  });
});
</script>
