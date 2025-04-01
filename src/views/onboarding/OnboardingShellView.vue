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
      <router-view v-slot="{ Component }">
        <component
          :is="Component"
          ref="currentComponentRef"
          @notify="showSnackbar"
        />
      </router-view>
    </v-stepper-window>

    <v-stepper-actions
      :next-text="'Volgende'"
      :prev-text="'Terug'"
      @click:next="nextStep"
      @click:prev="prevStep"
    />
  </v-stepper>

  <v-snackbar v-model="snackbar" :timeout="3000" location="bottom center">
    {{ snackbarText }}
  </v-snackbar>
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
const currentComponentRef = ref(null);

const snackbar = ref(false);
const snackbarText = ref('');

const showSnackbar = (message) => {
  snackbarText.value = message;
  snackbar.value = true;
};

watch(
  () => route.path,
  (path) => {
    const index = steps.findIndex((step) => path.includes(step.route));
    if (index !== -1) step.value = index + 1;
  },
  { immediate: true }
);

const nextStep = async () => {
  if (currentComponentRef.value?.submit) {
    const success = await currentComponentRef.value.submit();
    if (!success) return;
  }

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
