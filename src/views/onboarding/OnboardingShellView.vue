<template>
  <div class="content">
    <v-stepper v-model="step" class="stepper">
      <v-stepper-header class="stepper-header">
        <template v-for="(item, index) in steps" :key="item.route">
          <v-stepper-item
            :title="item.label"
            :value="index + 1"
            :complete="step > index + 1"
          />
          <v-divider v-if="index < steps.length - 1" />
        </template>
      </v-stepper-header>

      <v-stepper-window class="stepper-window">
        <router-view v-slot="{ Component }">
          <component
            :is="Component"
            ref="currentComponentRef"
            @notify="showSnackbar"
          />
        </router-view>
      </v-stepper-window>

      <v-stepper-actions
        class="stepper-actions"
        :next-text="isLastStep ? 'Afronden' : 'Volgende'"
        :prev-text="'Terug'"
        @click:next="isLastStep ? finish() : nextStep()"
        @click:prev="prevStep"
        disabled="false"
      />
    </v-stepper>

    <v-snackbar v-model="snackbar" :timeout="3000" location="bottom center">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const steps = [
  { label: 'Bedrijfsinfo', route: 'company-info' },
  { label: 'Logo', route: 'upload-logo' },
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

const isLastStep = computed(() => {
  return step.value === steps.length;
});

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

const prevStep = async () => {
  if (currentComponentRef.value?.submit) {
    const success = await currentComponentRef.value.submit();
    if (!success) return;
  }

  const prev = steps[step.value - 2];
  if (prev) router.push(`/onboarding/${prev.route}`);
};

const finish = () => {
  console.log('finished');
};
</script>

<style scoped>
.content {
  max-width: 70vw;
  margin: 0 auto;
}

.stepper {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
}

.stepper-header {
  min-height: 72px;
}

.stepper-window {
  flex: 1 1 auto;
  overflow-y: auto;
}

.stepper-actions {
  position: sticky;
  bottom: 0;
}
</style>
