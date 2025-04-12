<template>
  <v-container v-if="user">
    <v-card class="pa-5 mx-auto" max-width="800">
      <v-card-title class="text-center mb-5"
        >Beschrijf je workflow</v-card-title
      >

      <v-card-text>
        <v-form ref="formRef" v-model="valid" lazy-validation>
          <div
            v-for="question in visibleQuestions"
            :key="question.key"
            class="mb-4"
          >
            <v-select
              v-if="question.type === 'select'"
              v-model="formData[question.key]"
              :label="question.label"
              :items="question.options"
              item-title="label"
              item-value="value"
              :rules="[required]"
              :loading="loading"
              :disabled="loading"
              clearable
            />
            <v-text-field
              v-else-if="question.type === 'number'"
              v-model="formData[question.key]"
              :label="question.label"
              type="number"
              :rules="[required]"
              :loading="loading"
              :disabled="loading"
            />
            <div v-else class="text-red">
              Unsupported type: {{ question.type }}
            </div>
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
          Volgende</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>

  <v-container v-else> Geen gebruiker gevonden. Log in. </v-container>
</template>

<script setup>
import { ref, watch, defineExpose, defineEmits, onMounted, inject } from 'vue';
import jsonata from 'jsonata';
import { auth, db } from '@/firebase';
import { ref as dbRef, set, get } from 'firebase/database';
import workflowQuestions from '@/workflowQuestions';

const onboarding = inject('onboardingControls');

const emit = defineEmits(['notify']);

const user = auth.currentUser;
const formRef = ref(null);
const valid = ref(false);
const loading = ref(true);

const formData = ref({});
const visibleQuestions = ref([]);

const required = (v) =>
  (v !== undefined && v !== null && v !== '') || 'Dit veld is verplicht';

const allQuestions = workflowQuestions;

watch(
  formData,
  async (newData) => {
    const result = [];

    for (const question of allQuestions) {
      if (!question.condition) {
        result.push(question);
        continue;
      }

      try {
        const expr = jsonata(question.condition);
        const isVisible = await expr.evaluate(newData);
        if (isVisible === true) {
          result.push(question);
        }
      } catch (err) {
        console.warn(`Fout bij evaluatie van ${question.key}:`, err.message);
      }
    }

    visibleQuestions.value = result;
  },
  { immediate: true, deep: true }
);

const submit = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid?.valid || !user) return false;

  try {
    const workflowRef = dbRef(db, `workflow/${user.uid}`);
    await set(workflowRef, formData.value);
    emit('notify', 'Workflowvragen succesvol opgeslagen!');
    return true;
  } catch (e) {
    console.error('Fout bij opslaan workflowvragen:', e);
    emit('notify', 'Fout bij opslaan workflowvragen', 'error');
    return false;
  }
};

onMounted(async () => {
  if (user) {
    try {
      const refPath = dbRef(db, `workflow/${user.uid}`);
      const snapshot = await get(refPath);
      if (snapshot.exists()) {
        formData.value = snapshot.val();
      }
    } catch (err) {
      console.error('Fout bij ophalen workflowdata:', err.message);
    } finally {
      loading.value = false;
    }
  }
});

defineExpose({ submit });
</script>
