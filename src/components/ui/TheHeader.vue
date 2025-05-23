<template>
  <v-app-bar elevation="1">
    <v-container max-width="70vw" class="d-flex align-center justify-end">
      <!-- Logo -->
      <v-app-bar-title class="mr-auto">
        <router-link to="/">
          <v-img :src="logo" width="120" class="cursor-pointer"></v-img>
        </router-link>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Navigation Menu -->
      <div v-for="(menu, index) in menuItems" :key="index">
        <v-menu open-on-hover transition="slide-y-transition">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="mx-1">
              {{ menu.title }}
              <v-icon end>mdi-chevron-down</v-icon>
            </v-btn>
          </template>

          <v-list elevation="1" style="margin-top: 14px">
            <v-list-item
              v-for="(subItem, subIndex) in menu.items"
              :key="subIndex"
              :to="subItem.route"
            >
              <template v-slot:prepend>
                <v-icon>{{ subItem.icon }}</v-icon>
              </template>
              <v-list-item-title>{{ subItem.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <!-- Dynamic User Profile Dropdown -->
      <v-menu
        v-if="user"
        class="ml-5"
        open-on-hover
        transition="slide-y-transition"
      >
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon>
            <v-icon icon="mdi-account-circle"></v-icon>
          </v-btn>
        </template>

        <v-list elevation="1" style="margin-top: 8px">
          <v-list-item class="mb-1">
            <v-list-item-title>{{
              user.displayName || 'User'
            }}</v-list-item-title>
            <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
          </v-list-item>

          <v-divider class="my-2"></v-divider>

          <v-list-item to="/profile">
            <template v-slot:prepend>
              <v-icon>mdi-account-cog</v-icon>
            </template>
            <v-list-item-title>Profiel</v-list-item-title>
          </v-list-item>

          <v-list-item @click="logout">
            <template v-slot:prepend>
              <v-icon>mdi-logout</v-icon>
            </template>
            <v-list-item-title>Log Uit</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Show "Log In" Button When Not Logged In -->
      <v-btn v-else class="mx-1" color="primary" variant="text" to="/login">
        <template v-slot:prepend>
          <v-icon>mdi-login</v-icon>
        </template>
        Log In
      </v-btn>
    </v-container>
  </v-app-bar>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { auth } from '@/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import logo from '@/assets/pti/PTI-logo_landscape.svg';

const user = ref(null);

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
  });
});

const logout = async () => {
  try {
    await signOut(auth);
    location.reload();
    user.value = null;
  } catch (error) {
    console.error('Logout error:', error.message);
  }
};

const menuItems = ref([
  {
    title: 'Branches',
    items: [
      { title: 'Bouw en Vastgoed', icon: 'mdi-home-city', route: '/bouw' },
      { title: 'IT en ITES', icon: 'mdi-desktop-classic', route: '/it' },
      {
        title: 'Gezondheidszorg',
        icon: 'mdi-hospital-box',
        route: '/healthcare',
      },
      { title: 'Productie', icon: 'mdi-factory', route: '/production' },
      {
        title: 'Vervoer en Logistiek',
        icon: 'mdi-truck-fast',
        route: '/logistics',
      },
    ],
  },
  {
    title: 'Modules',
    items: [
      {
        title: 'Werkorderbeheer',
        icon: 'mdi-file-document-outline',
        route: '/workorders',
      },
      { title: 'Gebruikersbeheer', icon: 'mdi-account-group', route: '/users' },
      { title: 'Procesbeheer', icon: 'mdi-cogs', route: '/processes' },
      {
        title: 'Projectbeheer',
        icon: 'mdi-briefcase-outline',
        route: '/projects',
      },
      { title: 'Planning', icon: 'mdi-calendar-clock', route: '/planning' },
      {
        title: 'Verdeeltool',
        icon: 'mdi-arrow-decision',
        route: '/distribution',
      },
      {
        title: 'Klantenportaal',
        icon: 'mdi-account-arrow-right',
        route: '/customer-portal',
      },
      {
        title: 'Klantcommunicatie',
        icon: 'mdi-email-outline',
        route: '/communication',
      },
    ],
  },
  {
    title: 'Tarieven',
    items: [
      { title: 'Calculator', icon: 'mdi-calculator', route: '/calculator' },
      { title: 'Info', icon: 'mdi-information-outline', route: '/info' },
      { title: 'Bestanden', icon: 'mdi-file-outline', route: '/files' },
    ],
  },
]);
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
