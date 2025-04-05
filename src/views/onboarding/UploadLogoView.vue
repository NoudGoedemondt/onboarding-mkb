<template>
  <v-container v-if="user">
    <v-card class="pa-5 mx-auto" max-width="600">
      <v-card-title class="text-h5">Upload je logo</v-card-title>
      <v-card-text>
        <v-form ref="formRef" v-model="valid" lazy-validation>
          <!-- File input -->
          <v-file-input
            v-model="selectedFile"
            label="Kies een SVG-bestand"
            accept=".svg"
            :rules="[hasUploadedFile]"
            :loading="loading"
            :disabled="loading"
          />

          <!-- Preview -->
          <div v-if="preview" class="mt-4">
            <p class="text-subtitle-1">Voorbeeld:</p>
            <img :src="preview" alt="Logo preview" style="max-height: 120px" />
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>

  <v-container v-else> Geen gebruiker gevonden. Log in. </v-container>
</template>

<script setup>
//TODO: No functionality available for reuploading the logo

import { ref, watch, defineExpose, defineEmits, onMounted } from 'vue';
import { auth, db } from '@/firebase';
import { ref as dbRef, set, get } from 'firebase/database';

const emit = defineEmits(['notify']);

const user = auth.currentUser;

const formRef = ref(null);
const valid = ref(false);
const loading = ref(true);

const selectedFile = ref(null);
const preview = ref('');
const logoBase64 = ref('');

const hasUploadedFile = () => {
  return selectedFile.value || logoBase64.value
    ? true
    : 'Geen geldig bestand geselecteerd.';
};

watch(selectedFile, (file) => {
  if (!file || !(file instanceof Blob)) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    logoBase64.value = e.target.result;
    preview.value = e.target.result;
  };
  reader.readAsDataURL(file);
});

const submit = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid?.valid || !user || !logoBase64.value) return false;

  try {
    const logoRef = dbRef(db, `logos/${user.uid}`);
    await set(logoRef, { base64: logoBase64.value });
    emit('notify', 'Logo succesvol opgeslagen!');
    return true;
  } catch (e) {
    console.error('Fout bij opslaan logo:', e);
    emit('notify', 'Fout bij opslaan logo', 'error');
    return false;
  }
};

onMounted(async () => {
  if (user) {
    try {
      const logoRef = dbRef(db, `logos/${user.uid}`);
      const snapshot = await get(logoRef);
      if (snapshot.exists()) {
        logoBase64.value = snapshot.val().base64;
        preview.value = snapshot.val().base64;
      }
    } catch (err) {
      console.error('Fout bij ophalen logo:', err.message);
    } finally {
      loading.value = false;
    }
  }
});

defineExpose({ submit });
</script>
