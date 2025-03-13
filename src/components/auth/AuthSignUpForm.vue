<template>
  <v-form v-model="form" @submit.prevent="onSubmit">
    <!-- Name Field -->
    <v-text-field
      v-model="name"
      :readonly="loading"
      :rules="[required]"
      class="mb-2"
      label="Name"
    ></v-text-field>

    <!-- Email Field -->
    <v-text-field
      v-model="email"
      :readonly="loading"
      :rules="[required, validEmail]"
      class="mb-2"
      label="Email"
    ></v-text-field>

    <!-- Password Field -->
    <v-text-field
      v-model="password"
      :readonly="loading"
      :rules="[required, minPassword]"
      class="mb-2"
      label="Password"
      placeholder="Enter your password"
      type="password"
    ></v-text-field>

    <!-- Confirm Password Field -->
    <v-text-field
      v-model="confirmPassword"
      :readonly="loading"
      :rules="[required, passwordMatch]"
      label="Confirm Password"
      placeholder="Re-enter your password"
      type="password"
    ></v-text-field>

    <br />

    <!-- Register Button -->
    <v-btn
      :disabled="!form"
      :loading="loading"
      color="primary"
      size="large"
      type="submit"
      variant="elevated"
      block
    >
      Register
    </v-btn>
  </v-form>
</template>

<script setup>
import { ref } from 'vue';

import { auth } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';

const form = ref(false);
const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);

const required = (v) => !!v || 'Field is required';
const validEmail = (v) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v) ||
  'Enter a valid email address';
const minPassword = (v) =>
  (v && v.length >= 6) || 'Password must be at least 6 characters';
const passwordMatch = (v) => v === password.value || 'Passwords do not match';

const register = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    await updateProfile(userCredential.user, {
      displayName: name.value,
    });

    //Log out and reload page to get redirected to log in screen
    await signOut(auth);
    location.reload();

    console.log('User registered:', userCredential.user);
  } catch (error) {
    console.error('Registration error:', error.message);
  }
};

const onSubmit = async () => {
  if (!form.value) return;
  loading.value = true;

  try {
    await register();
  } catch (error) {
    console.error(error.message);
  } finally {
    loading.value = false;
  }
};
</script>
