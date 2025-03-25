<template>
  <v-card class="mx-auto pa-4" max-width="600">
    <v-card-title>Account verwijderen</v-card-title>
    <v-card-actions class="d-flex justify-end">
      <v-btn color="error" @click="dialog = true" variant="elevated"
        >Verwijder account</v-btn
      >
    </v-card-actions>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6">Bevestig met wachtwoord</v-card-title>
        <v-card-text>
          <p>
            Om je account te verwijderen moet je je wachtwoord opnieuw invoeren.
          </p>
          <v-text-field
            v-model="password"
            label="Wachtwoord"
            type="password"
            :disabled="loading"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog = false" variant="text">Annuleren</v-btn>
          <v-btn color="error" @click="deleteAccount" :loading="loading">
            Verwijder
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from 'firebase/auth';
import { db } from '@/firebase';
import { ref as dbRef, remove } from 'firebase/database';

const emit = defineEmits(['notify']);

const router = useRouter();
const auth = getAuth();
const user = auth.currentUser;

const dialog = ref(false);
const password = ref('');
const loading = ref(false);

const deleteUserData = async () => {
  const user = getAuth().currentUser;
  const companyRef = dbRef(db, `companies/${user.uid}`);
  try {
    console.log('Bedrijfsgegevens verwijderen voor gebruiker', user.uid);
    await remove(companyRef);
  } catch (err) {
    console.error('Fout bij verwijderen bedrijf', err.message);
  }
};

const deleteAccount = async () => {
  if (!user || !password.value) return;

  loading.value = true;

  const credential = EmailAuthProvider.credential(user.email, password.value);

  try {
    // Stap 1: Re-authenticate
    await reauthenticateWithCredential(user, credential);

    // Stap 2: Verwijder account
    await deleteUserData();
    await deleteUser(user);

    emit('notify', 'Account succesvol verwijderd');

    // Redirect na korte vertraging
    setTimeout(() => router.push('/register'), 1500);
  } catch (error) {
    console.error('Fout bij verwijderen:', error);

    emit('notify', error.message);
  } finally {
    loading.value = false;
    dialog.value = false;
    password.value = '';
  }
};
</script>
