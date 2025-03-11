<template>
  <div>
    <h2>Login</h2>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="signIn">Sign In</button>
    <button @click="register">Register</button>
    <button @click="signInWithGoogle">Sign In with Google</button>
    <button v-if="user" @click="logout">Logout</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const email = ref('');
const password = ref('');
const user = ref(null);

// Monitor auth state
onAuthStateChanged(auth, (currentUser) => {
  user.value = currentUser;
});

const signIn = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    console.log('User signed in:', auth.currentUser);
  } catch (error) {
    console.error(error.message);
  }
};

const register = async () => {
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    console.log('User registered:', auth.currentUser);
  } catch (error) {
    console.error(error.message);
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    console.log('User signed out');
  } catch (error) {
    console.error(error.message);
  }
};
</script>
