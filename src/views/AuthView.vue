<template>
  <div>
    <auth-base />
  </div>
</template>

<script setup>
import AuthBase from '@/components/auth/AuthBase.vue';
import { ref } from 'vue';
import { auth } from '../firebase';
import {
  // signInWithEmailAndPassword,
  // createUserWithEmailAndPassword,
  // signOut,
  onAuthStateChanged,
} from 'firebase/auth';

// const email = ref('');
// const password = ref('');
const user = ref(null);

// Monitor auth state
onAuthStateChanged(auth, (currentUser) => {
  user.value = currentUser;
});

// const signIn = async () => {
//   try {
//     await signInWithEmailAndPassword(auth, email.value, password.value);
//     console.log('User signed in:', auth.currentUser);
//   } catch (error) {
//     console.error(error.message);
//   }
// };

// const register = async () => {
//   try {
//     await createUserWithEmailAndPassword(auth, email.value, password.value);
//     console.log('User registered:', auth.currentUser);
//   } catch (error) {
//     console.error(error.message);
//   }
// };

// const logout = async () => {
//   try {
//     await signOut(auth);
//     console.log('User signed out');
//   } catch (error) {
//     console.error(error.message);
//   }
// };
</script>
