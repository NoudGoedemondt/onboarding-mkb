<template>
  <v-container>
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
              :rules="[required]"
              clearable
            />
            <v-text-field
              v-else-if="question.type === 'number'"
              v-model="formData[question.key]"
              :label="question.label"
              type="number"
              :rules="[required]"
            />
            <div v-else class="text-red">
              Unsupported type: {{ question.type }}
            </div>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue';
import jsonata from 'jsonata';

const formRef = ref(null);
const valid = ref(false);

const formData = ref({});
const visibleQuestions = ref([]);

const required = (v) => !!v || 'Dit veld is verplicht';

const allQuestions = [
  {
    key: 'selfSchedule',
    label: 'Mag de klant zelf een afspraak inplannen?',
    type: 'select',
    options: ['Ja', 'Nee'],
  },
  {
    key: 'confirmAppointment',
    label: 'Moet de klant de afspraak bevestigen?',
    type: 'select',
    options: ['Ja', 'Nee'],
    condition: "$.selfSchedule = 'Ja'",
  },
  {
    key: 'followUp',
    label: 'Wil je automatische opvolging als de klant niet reageert?',
    type: 'select',
    options: ['Ja', 'Nee'],
    condition: "$.confirmAppointment = 'Ja'",
  },
  {
    key: 'revisit',
    label: 'Moeten vervolgbezoeken worden ingepland?',
    type: 'select',
    options: ['Ja', 'Nee'],
    condition: "$.selfSchedule = 'Nee'",
  },
  {
    key: 'reminders',
    label: 'Wil je herinneringen sturen voorafgaand aan de afspraak?',
    type: 'select',
    options: ['Ja', 'Nee'],
  },
  {
    key: 'afterMessage',
    label: 'Wat ontvangt de klant na de werkopdracht?',
    type: 'select',
    options: ['Samenvatting', 'Bevestiging', 'Geen bericht'],
  },
  {
    key: 'preInspection',
    label: 'Is er een schouwing vereist voor uitvoering?',
    type: 'select',
    options: ['Ja', 'Nee'],
  },
  {
    key: 'qcAfter',
    label: 'Moet er een kwaliteitscontrole plaatsvinden na afloop?',
    type: 'select',
    options: ['Ja', 'Nee'],
  },
  {
    key: 'autoCloseDays',
    label:
      'Na hoeveel dagen moet een werkopdracht automatisch worden gesloten?',
    type: 'number',
    condition: "$.qcAfter = 'Ja'",
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
</script>
