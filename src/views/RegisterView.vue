<template>
  <v-sheet rounded class="background">
    <v-card class="px-6 py-8" min-width="400">
      <v-card-title class="text-center mb-4">
        Registreer je als nieuwe gebruiker
      </v-card-title>

      <v-form v-model="form" @submit.prevent="onSubmit">
        <v-text-field
          v-model="firstName"
          :readonly="loading"
          :rules="[required]"
          label="Voornaam"
        ></v-text-field>

        <v-text-field
          v-model="lastName"
          :readonly="loading"
          :rules="[required]"
          label="Achternaam"
        ></v-text-field>

        <v-text-field
          v-model="email"
          :readonly="loading"
          :rules="[required, validEmail]"
          label="Email"
        ></v-text-field>

        <br />

        <v-text-field
          v-model="password"
          :readonly="loading"
          :rules="[required, minPassword]"
          label="Wachtwoord"
          type="password"
        ></v-text-field>

        <v-text-field
          v-model="confirmPassword"
          :readonly="loading"
          :rules="[required, passwordMatch]"
          label="Bevestig Wachtwoord"
          type="password"
        ></v-text-field>

        <v-btn
          class="mt-5"
          :disabled="!form"
          :loading="loading"
          color="primary"
          size="large"
          type="submit"
          variant="elevated"
          block
        >
          Registreer
        </v-btn>
      </v-form>

      <v-card-text class="text-center">
        <span>
          Al een gebruiker?
          <a class="text-primary" style="cursor: pointer" @click="goToLogin"
            >Log in</a
          >
        </span>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { auth } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const router = useRouter();
const route = useRoute();

const form = ref(false);
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);

//input field validation checks
const required = (v) => !!v || 'Veld is verplicht';
const validEmail = (v) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v) ||
  'Voer een geldig e-mailadres in';
const minPassword = (v) =>
  (v && v.length >= 6) || 'Wachtwoord moet minimaal 6 tekens lang zijn';
const passwordMatch = (v) =>
  v === password.value || 'Wachtwoorden komen niet overeen';

const getFullName = () => {
  const trimmedFirst = firstName.value.trim();
  const trimmedLast = lastName.value.trim();
  return `${trimmedFirst} ${trimmedLast}`.trim(); // Avoid extra spaces
};

const register = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    await updateProfile(userCredential.user, {
      displayName: getFullName(),
    });

    const redirectPath = route.query.redirect || '/';
    router.push(redirectPath);

    console.log('User registered:', userCredential.user);
  } catch (error) {
    console.error('Registration error:', error.message);
  }
};

const goToLogin = () => {
  router.push({ path: '/login', query: { redirect: route.query.redirect } });
};

const onSubmit = async () => {
  if (!form.value) return;
  loading.value = true;

  try {
    await register();
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.background {
  height: calc(100vh - 64px);
  background: url('@/assets/pti/Waves 2 Cropped.png') no-repeat center center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 64px;
}
</style>
