<template>
  <v-form v-model="form" @submit.prevent="onSubmit">
    <v-text-field
      v-model="email"
      :readonly="loading"
      :rules="[required]"
      class="mb-2"
      label="Email"
      clearable
    ></v-text-field>

    <v-text-field
      v-model="password"
      :readonly="loading"
      :rules="[required]"
      label="Password"
      placeholder="Enter your password"
      clearable
    ></v-text-field>

    <br />

    <v-btn
      :disabled="!form"
      :loading="loading"
      color="primary"
      size="large"
      type="submit"
      variant="elevated"
      block
    >
      Sign In
    </v-btn>
  </v-form>
</template>

<script setup>
import { ref } from 'vue';

const form = ref(false);
const email = ref(null);
const password = ref(null);
const loading = ref(false);

function onSubmit() {
  if (!form.value) return;
  loading.value = true;
  setTimeout(() => (loading.value = false), 2000);
}
function required(v) {
  return !!v || 'Field is required';
}
</script>
