<template>
  <v-container v-if="user">
    <v-card class="pa-5 mx-auto" max-width="600">
      <v-card-title class="text-center mb-5">Upload je logo</v-card-title>

      <v-card-text>
        <v-form ref="formRef" v-model="valid" lazy-validation>
          <div class="drop-zone" @dragover.prevent @drop.prevent="handleDrop">
            <div v-if="preview" class="preview-wrapper">
              <img :src="preview" alt="Logo preview" />
              <p class="file-name">{{ selectedFile?.name }}</p>
              <v-btn
                icon
                variant="plain"
                size="small"
                @click="removeFile"
                class="remove-button"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>

            <div v-else>
              <v-icon size="64" color="primary">mdi-cloud-upload</v-icon>
              <v-btn class="mt-2" color="primary" @click="selectFile">
                Select
              </v-btn>
              <p class="text-caption text-primary mt-1">
                OF SLEEP JE BESTAND HIER
              </p>
            </div>

            <input
              ref="fileInput"
              type="file"
              accept=".svg"
              class="d-none"
              @change="onFileChange"
            />
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-space-between">
        <v-btn @click="onboarding.prevStep?.()">Terug</v-btn>
        <v-btn
          @click="onboarding.nextStep?.()"
          variant="elevated"
          color="primary"
        >
          Volgende
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>

  <v-container v-else>Geen gebruiker gevonden. Log in.</v-container>
</template>

<script setup>
import { ref, defineExpose, defineEmits, onMounted, inject } from 'vue';
import { auth, db } from '@/firebase';
import { ref as dbRef, set, get } from 'firebase/database';

const onboarding = inject('onboardingControls');
const emit = defineEmits(['notify']);

const user = auth.currentUser;
const formRef = ref(null);
const valid = ref(false);
const loading = ref(true);

const selectedFile = ref(null);
const preview = ref('');
const logoBase64 = ref('');
const fileInput = ref(null);

const onFileChange = (event) => {
  const file = event.target.files[0];
  processFile(file);
};

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0];
  processFile(file);
};

const processFile = (file) => {
  if (!file || !file.name.endsWith('.svg')) {
    emit('notify', 'Alleen SVG-bestanden zijn toegestaan.', 'error');
    return;
  }

  selectedFile.value = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    logoBase64.value = e.target.result;
    preview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};

const selectFile = () => {
  fileInput.value?.click();
};

const removeFile = () => {
  selectedFile.value = null;
  preview.value = '';
  logoBase64.value = '';
};

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

<style scoped>
.drop-zone {
  border: 2px dotted #cfd8dc;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  background-color: #fff;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
}

.drop-zone:hover {
  background-color: #f5f5f5;
}

.preview-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.preview-wrapper img {
  max-height: 64px;
  margin-bottom: 8px;
}

.file-name {
  font-size: 0.9rem;
  color: #333;
  word-break: break-all;
}

.remove-button {
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: #ffffff;
}

.d-none {
  display: none;
}
</style>
