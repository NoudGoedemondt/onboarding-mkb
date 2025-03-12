<template>
  <v-sheet rounded>
    <v-card class="mt-5 mx-auto px-6 py-8" max-width="344">
      <!-- Toggle between sign-in and sign-up -->
      <auth-sign-in-form v-if="authMethod === 'sign-in'" />
      <auth-sign-up-form v-else />

      <v-card-text class="text-center">
        <span>
          {{ toggleMessage }}
          <a
            class="text-primary"
            style="cursor: pointer"
            @click="toggleAuthMethod"
            >{{ toggleLink }}</a
          >
        </span>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<script setup>
import { ref, computed } from 'vue';
import AuthSignInForm from './AuthSignInForm.vue';
import AuthSignUpForm from './AuthSignUpForm.vue';

const authMethod = ref('sign-in');

const toggleMessage = computed(() =>
  authMethod.value === 'sign-in' ? 'Not a user yet?' : 'Already a user?'
);

const toggleLink = computed(() =>
  authMethod.value === 'sign-in' ? ' Register' : ' Sign in'
);

const toggleAuthMethod = () => {
  authMethod.value = authMethod.value === 'sign-in' ? 'sign-up' : 'sign-in';
};
</script>
