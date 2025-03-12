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
  <div class="mt-5 text-center">
    logged in as:
    <p v-if="user">{{ user }}</p>
    <p v-else>not logged in</p>

    <v-btn @click="logout">logout</v-btn>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { auth } from '@/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';

import AuthSignInForm from './AuthSignInForm.vue';
import AuthSignUpForm from './AuthSignUpForm.vue';

const user = ref(null);
const authMethod = ref('sign-in');

const toggleMessage = computed(() =>
  authMethod.value === 'sign-in' ? 'Not a user yet?' : 'Already a user?'
);
const toggleLink = computed(() =>
  authMethod.value === 'sign-in' ? ' Register' : ' Sign in'
);

const logout = async () => {
  try {
    await signOut(auth);
    console.log('User signed out');
  } catch (error) {
    console.error(error.message);
  }
};

onAuthStateChanged(auth, (currentUser) => {
  user.value = currentUser;
});

const toggleAuthMethod = () => {
  authMethod.value = authMethod.value === 'sign-in' ? 'sign-up' : 'sign-in';
};
</script>
