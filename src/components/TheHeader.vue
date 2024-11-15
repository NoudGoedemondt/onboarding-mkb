<template>
  <div>
    <v-app-bar :height="activeMenuItemIndex !== null ? 280 : 64">
      <v-container max-width="70vw" class="top-container d-flex align-center">
        <v-app-bar-title>
          <router-link to="/">
            <v-img :src="logo" width="120" class="cursos-pointer"></v-img>
          </router-link>
        </v-app-bar-title>

        <v-btn
          v-for="(items, index) in menuItems"
          :key="index"
          @click="setActiveMenuItemIndex(index)"
          :prepend-icon="
            index === activeMenuItemIndex
              ? 'mdi-chevron-down'
              : 'mdi-chevron-up'
          "
        >
          {{ items.title }}
        </v-btn>
      </v-container>

      <v-container
        v-if="activeMenuItemIndex !== null"
        max-width="70vw"
        class="expanded-content"
      >
        <v-row>
          <v-col
            cols="12"
            md="4"
            v-for="(subItems, index) in activeMenuItems"
            :key="index"
          >
            <v-list-item :to="subItems.route">
              <template v-slot:prepend>
                <v-icon :icon="subItems.icon"></v-icon>
              </template>
              <v-list-item-title>{{ subItems.title }}</v-list-item-title>
            </v-list-item>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import logo from '@/assets/PTI-logo_landscape.svg';

const activeMenuItemIndex = ref(null);

const menuItems = ref([
  {
    title: 'Branches',
    items: [
      { title: 'Bouw en Vastgoed', icon: 'mdi-home-city', route: '/test' },
      { title: 'IT en ITES', icon: 'mdi-desktop-classic', route: '/test' },
      { title: 'Gezondheidszorg', icon: 'mdi-hospital-box', route: '/test' },
      { title: 'Productie', icon: 'mdi-factory', route: '/test' },
      { title: 'Vervoer en Logistiek', icon: 'mdi-truck-fast', route: '/test' },
    ],
  },
  {
    title: 'Modules',
    items: [
      {
        title: 'Werkorderbeheer',
        icon: 'mdi-file-document-outline',
        route: '/test',
      },
      { title: 'Gebruikersbeheer', icon: 'mdi-account-group', route: '/test' },
      { title: 'Procesbeheer', icon: 'mdi-cogs', route: '/test' },
      { title: 'Projectbeheer', icon: 'mdi-briefcase-outline', route: '/test' },
      { title: 'Planning', icon: 'mdi-calendar-clock', route: '/test' },
      { title: 'Verdeeltool', icon: 'mdi-arrow-decision', route: '/test' },
      {
        title: 'Klantenportaal',
        icon: 'mdi-account-arrow-right',
        route: '/test',
      },
      { title: 'Klantcommunicatie', icon: 'mdi-email-outline', route: '/test' },
    ],
  },
  {
    title: 'Tarieven',
    items: [
      { title: 'Calculator', icon: 'mdi-calculator', route: '/test' },
      { title: 'Lorem', icon: 'mdi-information-outline', route: '/test' },
      { title: 'Lorem', icon: 'mdi-file-outline', route: '/test' },
    ],
  },
]);

const activeMenuItems = computed(() =>
  activeMenuItemIndex.value !== null
    ? menuItems.value[activeMenuItemIndex.value].items
    : []
);

const setActiveMenuItemIndex = (index) =>
  activeMenuItemIndex.value === index
    ? (activeMenuItemIndex.value = null)
    : (activeMenuItemIndex.value = index);
</script>

<style scoped>
.top-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
}

.expanded-content {
  position: absolute;
  top: 64px;
  left: 0;
  right: 0;
  background: inherit;
}
</style>
