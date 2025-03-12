<template>
  <v-form v-model="form" @submit.prevent="onSubmit">
    <!-- Email Field -->
    <v-text-field
      v-model="email"
      :readonly="loading"
      :rules="[required, validEmail]"
      class="mb-2"
      label="Email"
      clearable
    ></v-text-field>

    <!-- Password Field -->
    <v-text-field
      v-model="password"
      :readonly="loading"
      :rules="[required, minPassword]"
      class="mb-2"
      label="Password"
      placeholder="Enter your password"
      clearable
      type="password"
    ></v-text-field>

    <!-- Confirm Password Field -->
    <v-text-field
      v-model="confirmPassword"
      :readonly="loading"
      :rules="[required, passwordMatch]"
      label="Re-enter Password"
      placeholder="Confirm your password"
      clearable
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

const form = ref(false);
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

const onSubmit = () => {
  if (!form.value) return;
  loading.value = true;

  //Function for registering users vvvvvv
  setTimeout(() => {
    loading.value = false;
    alert('User registered successfully!');
  }, 2000);
};
</script>
