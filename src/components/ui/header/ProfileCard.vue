<template>
  <v-sheet rounded>
    <v-card class="mx-auto px-6 py-8" max-width="200">
      <v-container class="text-center">
        <!-- Profile Picture -->
        <v-avatar color="primary">
          <v-icon icon="mdi-account-circle"></v-icon>
        </v-avatar>

        <!-- User Name -->
        <h2 class="mt-3">{{ user?.displayName || 'Guest User' }}</h2>

        <!-- Email -->
        <p class="text-grey-darken-1">
          {{ user?.email || 'No email available' }}
        </p>

        <!-- Edit Profile & Logout Buttons -->
        <v-btn color="primary" class="mt-3" @click="editProfile"
          >Edit Profile</v-btn
        >
        <v-btn color="error" class="mt-3 ml-2" @click="logout">Logout</v-btn>
      </v-container>
    </v-card>
  </v-sheet>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { auth } from '@/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const user = ref(null);

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
  });
});

const editProfile = () => {
  alert('Edit profile feature coming soon!');
};

const logout = async () => {
  try {
    await signOut(auth);
    user.value = null;
  } catch (error) {
    console.error('Logout error:', error.message);
  }
};
</script>
