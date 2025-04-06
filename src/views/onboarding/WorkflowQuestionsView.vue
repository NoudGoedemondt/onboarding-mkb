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
              :model-value="formData[question.key]"
              @update:model-value="updateFormValue(question.key, $event)"
              :label="question.label"
              :items="question.options"
              :rules="[required]"
            />
            <v-text-field
              v-else-if="question.type === 'number'"
              :model-value="formData[question.key]"
              @update:model-value="
                updateFormValue(question.key, Number($event))
              "
              :label="question.label"
              type="number"
              :rules="[required]"
            />
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import jsonata from 'jsonata';

const valid = ref(false);
const formRef = ref(null);
const formData = ref({});
const visibleQuestionsData = ref([]);
const required = (v) => !!v || 'Dit veld is verplicht';

// Function to explicitly update form values and trigger reactivity
const updateFormValue = async (key, value) => {
  console.log(`Updating ${key} with value:`, value);
  formData.value = { ...formData.value, [key]: value };

  // Re-evaluate questions when form data changes
  await updateVisibleQuestions();
};

const allQuestions = ref([
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
    key: 'revisit',
    label: 'Moeten vervolgbezoeken worden ingepland?',
    type: 'select',
    options: ['Ja', 'Nee'],
    condition: "$.selfSchedule = 'Nee'",
  },
  {
    key: 'autoCloseDays',
    label: 'Na hoeveel dagen moet een opdracht automatisch sluiten?',
    type: 'number',
    condition: "$.confirmAppointment = 'Ja'",
  },
]);

// Function to evaluate async JSONata expressions
async function evaluateJsonata(expression, data) {
  try {
    const expr = jsonata(expression);
    const result = await expr.evaluate(data);
    console.log(`Evaluated ${expression}:`, result);
    return result === true;
  } catch (e) {
    console.warn('JSONata evaluatie mislukt:', e.message);
    return false;
  }
}

// Function to update visible questions based on form data
async function updateVisibleQuestions() {
  const visible = [];

  for (const question of allQuestions.value) {
    if (!question.condition) {
      visible.push(question);
      continue;
    }

    const shouldShow = await evaluateJsonata(
      question.condition,
      formData.value
    );
    if (shouldShow) {
      visible.push(question);
    }
  }

  visibleQuestionsData.value = visible;
  console.log(
    'Updated visible questions:',
    visible.map((q) => q.key)
  );
}

// Use a regular ref instead of computed for async operations
const visibleQuestions = computed(() => {
  return visibleQuestionsData.value;
});

// Initialize visible questions on mount
onMounted(async () => {
  await updateVisibleQuestions();
});

// Debug watcher
watch(
  formData,
  (newVal) => {
    console.log('Form data changed:', newVal);
  },
  { deep: true }
);
</script>
