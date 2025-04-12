<template>
  <v-sheet class="background">
    <v-stepper v-model="step" class="stepper" elevation="0">
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

      <transition :name="transitionName" mode="out-in">
        <v-stepper-window
          :key="route.fullPath"
          class="stepper-window pa-0 ma-0"
        >
          <router-view v-slot="{ Component }">
            <component
              :is="Component"
              ref="currentComponentRef"
              @notify="showSnackbar"
            />
          </router-view>
        </v-stepper-window>
      </transition>
    </v-stepper>

    <v-snackbar v-model="snackbar" :timeout="3000" location="bottom center">
      {{ snackbarText }}
    </v-snackbar>
  </v-sheet>
</template>

<script setup>
import { ref, watch, provide } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const steps = [
  { label: 'Bedrijfsgegevens', route: 'company-info' },
  { label: 'Logo', route: 'upload-logo' },
  { label: 'Workflow', route: 'workflow-questions' },
  { label: 'Samenvatting', route: 'summary' },
];

const step = ref(1);
const transitionName = ref('slide-left');

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

  transitionName.value = 'slide-left';
  const next = steps[step.value];
  if (next) router.push(`/onboarding/${next.route}`);
};

const prevStep = async () => {
  if (currentComponentRef.value?.submit) {
    const success = await currentComponentRef.value.submit();
    if (!success) return;
  }

  transitionName.value = 'slide-right';
  const prev = steps[step.value - 2];
  if (prev) router.push(`/onboarding/${prev.route}`);
};

const finish = async () => {
  try {
    showSnackbar('Onboarding afgerond!');
    await router.push('/');
  } catch (error) {
    console.error('Fout bij afronden onboarding:', error.message);
    showSnackbar('Er is iets misgegaan bij het afronden.');
  }
};

provide('onboardingControls', {
  nextStep,
  prevStep,
  finish,
});
</script>

<style scoped>
.background {
  height: calc(100vh - 64px);
  background: url('@/assets/pti/Waves 2 Cropped.png') repeat center center;
  background-size: cover;
  background-attachment: fixed;
  display: flex;
  align-items: start;
  justify-content: center;
}

.stepper {
  display: flex;
  flex-direction: column;
  height: calc(
    100vh - 64px - 16px
  ); /* subtract app-header and stepper-header top margin height */
  background-color: transparent;
  width: 100%; /*have scrollbar appear at right side of the screen*/
  margin-top: 16px;
}

.stepper-header {
  min-height: 72px;
  background-color: white;
  width: 70vw;
  margin: 0 auto;
  border-radius: 4px;
}

.stepper-window {
  flex: 1 1 auto;
  overflow-y: auto;
}

.slide-left-enter-active,
.slide-right-leave-active {
  transition: all 0.15s ease-in;
}
.slide-left-leave-active,
.slide-right-enter-active {
  transition: all 0.15s ease-in;
}

.slide-left-enter-from {
  transform: translateY(-50%);
  opacity: 0;
}
.slide-left-leave-to {
  transform: translateY(50%);
  opacity: 0;
}

.slide-right-enter-from {
  transform: translateY(50%);
  opacity: 0;
}
.slide-right-leave-to {
  transform: translateY(-50%);
  opacity: 0;
}
</style>
