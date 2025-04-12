<template>
  <v-container v-if="user">
    <v-card class="pa-5 mx-auto" max-width="800">
      <v-card-title class="text-center mb-5">Samenvatting</v-card-title>

      <v-card-text>
        <v-form ref="formRef" v-model="valid" lazy-validation>
          <v-skeleton-loader v-if="loading" type="card" />

          <template v-else>
            <!-- Bedrijfsgegevens -->
            <v-card-title class="text-subtitle-1 mb-3"
              >Bedrijfsinformatie</v-card-title
            >

            <v-card-text class="mb-3">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <strong>Naam:</strong> {{ company.name || '-' }}
                </v-col>
                <v-col cols="12" sm="6">
                  <strong>Adres:</strong> {{ company.address || '-' }}
                </v-col>
                <v-col cols="6">
                  <strong>Postcode:</strong> {{ company.zip || '-' }}
                </v-col>
                <v-col cols="6">
                  <strong>Plaats:</strong> {{ company.city || '-' }}
                </v-col>
              </v-row>
            </v-card-text>

            <v-divider class="mb-3" />

            <!-- Logo -->
            <v-card-title class="text-subtitle-1 mb-3">Logo</v-card-title>

            <div>
              <img
                v-if="logo"
                :src="logo"
                alt="Logo preview"
                style="max-height: 64px; margin-bottom: 12px; margin-left: 4px"
              />
              <div v-else><em>Geen logo geüpload.</em></div>
            </div>

            <v-divider class="mb-3" />

            <!-- Workflowvragen -->
            <v-card-title class="text-subtitle-1 mb-3"
              >Workflowvragen</v-card-title
            >

            <v-card-text>
              <div v-if="workflow && Object.keys(workflow).length">
                <div v-for="(value, key) in workflow" :key="key" class="mb-3">
                  <strong class="mr-2">{{ getQuestionLabel(key) }}:</strong>
                  <p>{{ getAnswerLabel(key, value) }}</p>
                </div>
              </div>
              <div v-else>
                <em>Geen workflowvragen ingevuld.</em>
              </div>
            </v-card-text>

            <v-divider class="mb-3" />
          </template>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-space-between">
        <v-btn @click="onboarding.prevStep?.()">Terug</v-btn>
        <v-btn
          @click="onboarding.finish?.()"
          variant="elevated"
          color="primary"
        >
          Afronden
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>

  <v-container v-else>Geen gebruiker gevonden. Log in.</v-container>
</template>

<script setup>
import { ref, onMounted, inject, defineExpose } from 'vue';
import { auth, db } from '@/firebase';
import { ref as dbRef, get } from 'firebase/database';
import workflowQuestions from '@/workflowQuestions';

const onboarding = inject('onboardingControls');

const user = auth.currentUser;
const loading = ref(true);
const formRef = ref(null);
const valid = ref(false);

const company = ref({});
const logo = ref('');
const workflow = ref({});

const getQuestionLabel = (key) => {
  const q = workflowQuestions.find((q) => q.key === key);
  return q?.label ?? key;
};

const getAnswerLabel = (key, value) => {
  const q = workflowQuestions.find((q) => q.key === key);
  if (q?.type === 'select') {
    const option = q.options?.find((o) => o.value === value);
    return option?.label ?? value;
  }
  return value;
};

const submit = async () => {
  const isValid = await formRef.value?.validate();
  return isValid?.valid ?? false;
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

defineExpose({ submit });
</script>
