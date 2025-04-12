<template>
  <v-container v-if="user">
    <v-card class="pa-5 mx-auto" max-width="700">
      <v-card-title class="text-h5">Workflow Vragenlijst</v-card-title>
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

const allQuestions = [
  {
    key: 'selfSchedule',
    label:
      'Wil je dat de klant zelf een afspraak inplant via een online portaal?',
    type: 'select',
    options: [
      {
        label:
          'Ja, de klant ontvangt een uitnodiging om zelf een afspraak in te plannen',
        value: true,
      },
      {
        label: 'Nee, een planner plant de afspraak vooraf in',
        value: false,
      },
    ],
  },
  {
    key: 'confirmAppointment',
    label:
      'Wil je een vooraf geplande afspraak laten bevestigen door de klant?',
    type: 'select',
    options: [
      {
        label:
          'Ja, de klant moet expliciet bevestigen voordat de afspraak definitief is',
        value: true,
      },
      {
        label: 'Nee, de afspraak wordt automatisch definitief',
        value: false,
      },
    ],
    condition: '$.selfSchedule = false',
  },
  {
    key: 'followUp',
    label:
      'Wil je automatische opvolgingen versturen als de klant niet reageert?',
    type: 'select',
    options: [
      {
        label:
          'Ja, de klant ontvangt opvolgingen om hun afspraak te bevestigen',
        value: true,
      },
      { label: 'Nee, de klant ontvangt een enkele bevestiging', value: false },
    ],
  },
  {
    key: 'revisit',
    label:
      'Moeten vervolgbezoeken ingepland worden als het eerste bezoek niet succesvol is?',
    type: 'select',
    options: [
      {
        label:
          'Ja, vervolgbezoeken worden opnieuw ingepland tot de afspraak is uitgevoerd of deze handmatig wordt gesloten',
        value: true,
      },
      {
        label:
          'Nee, afspraken zijn direct uitvoerbaar en vereisen geen herplanning',
        value: false,
      },
    ],
  },
  {
    key: 'reminders',
    label: 'Wil je de klant herinneringen sturen voorafgaand aan de afspraak?',
    type: 'select',
    options: [
      {
        label: 'Ja, de klant krijgt herinneringen vóór de afspraak',
        value: true,
      },
      { label: 'Nee, geen herinneringen', value: false },
    ],
  },
  {
    key: 'afterMessage',
    label:
      'Wil je de klant een bericht sturen na afronding van de werkopdracht?',
    type: 'select',
    options: [
      { label: 'Ja, de klant ontvangt een samenvatting', value: 'summary' },
      { label: 'Ja, de klant ontvangt een bevestiging', value: 'confirmation' },
      { label: 'Nee, de klant ontvangt geen bericht', value: 'none' },
    ],
  },
  {
    key: 'preInspection',
    label: 'Moet er een schouwing plaatsvinden vóór de echte uitvoering?',
    type: 'select',
    options: [
      { label: 'Ja, schouwing verplicht', value: true },
      { label: 'Nee, direct uitvoeren', value: false },
    ],
  },
  {
    key: 'qcAfter',
    label:
      'Moet er na uitvoering een kwaliteitscontrole of goedkeuring plaatsvinden?',
    type: 'select',
    options: [
      { label: 'Ja, door een planner/technicus', value: true },
      { label: 'Nee, werkopdracht wordt direct gesloten', value: false },
    ],
  },
  {
    key: 'autoCloseDays',
    label:
      'Na hoeveel dagen moet een werkopdracht automatisch worden gesloten?',
    type: 'number',
  },
];

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
