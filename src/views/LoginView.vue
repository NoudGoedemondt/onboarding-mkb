<template>
  <v-sheet rounded>
    <v-card class="mt-5 mx-auto px-6 py-8" max-width="344">
      <v-form v-model="form" @submit.prevent="onSubmit">
        <!-- Email field -->
        <v-text-field
          v-model="email"
          :readonly="loading"
          :rules="[required]"
          class="mb-2"
          label="Email"
        ></v-text-field>

        <!-- Password field -->
        <v-text-field
          v-model="password"
          :readonly="loading"
          :rules="[required]"
          label="Wachtwoord"
          type="password"
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
          Log In
        </v-btn>
      </v-form>

      <v-card-text class="text-center">
        <span>
          Nog geen gebruiker?
          <a class="text-primary" style="cursor: pointer" @click="goToRegister"
            >Registreer</a
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
import { signInWithEmailAndPassword } from 'firebase/auth';

const router = useRouter();
const route = useRoute();

const form = ref(false);
const email = ref('');
const password = ref('');
const loading = ref(false);

const required = (v) => !!v || 'Veld is verplicht';

const signIn = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    console.log('User signed in:', auth.currentUser);

    email.value = '';
    password.value = '';

    const redirectPath = route.query.redirect || '/';
    router.push(redirectPath);
  } catch (error) {
    console.error(error.message);
  }
};

const goToRegister = () => {
  router.push({ path: '/register', query: { redirect: route.query.redirect } });
};

const onSubmit = async () => {
  if (!form.value) return;
  loading.value = true;

  try {
    await signIn();
  } catch (error) {
    console.error(error.message);
  } finally {
    loading.value = false;
  }
};
</script>
