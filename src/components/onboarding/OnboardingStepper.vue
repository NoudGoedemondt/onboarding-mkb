<template>
  <v-stepper v-model="step">
    <v-stepper-header>
      <v-stepper-item
        v-for="(item, index) in steps"
        :key="item.route"
        :title="item.label"
        :value="index + 1"
        :complete="step > index + 1"
        @click="goToStep(index + 1)"
      />
    </v-stepper-header>

    <v-stepper-window>
      <router-view />
    </v-stepper-window>

    <v-stepper-actions
      :next-text="'Volgende'"
      :prev-text="'Terug'"
      @click:next="nextStep"
      @click:prev="prevStep"
    />
  </v-stepper>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const steps = [
  { label: 'Bedrijfsinfo', route: 'company-info' },
  { label: 'Gebruik', route: 'usage-info' },
  { label: 'Workflow vragenlijst', route: 'workflow-questions' },
  { label: 'Samenvatting', route: 'summary' },
];

const step = ref(1);

watch(
  () => route.path,
  (path) => {
    const index = steps.findIndex((step) => path.includes(step.route));
    if (index !== -1) step.value = index + 1;
  },
  { immediate: true }
);

const nextStep = () => {
  const next = steps[step.value];
  if (next) router.push(`/onboarding/${next.route}`);
};

const prevStep = () => {
  const prev = steps[step.value - 2];
  if (prev) router.push(`/onboarding/${prev.route}`);
};

const goToStep = (index) => {
  const target = steps[index];
  if (target) router.push(`/onboarding/${target.route}`);
};
</script>
