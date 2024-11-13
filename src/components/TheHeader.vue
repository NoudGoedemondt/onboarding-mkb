<template>
  <div>
    <v-app-bar>
      <v-container max-width="70vw" class="d-flex align-center">
        <v-app-bar-title>
          <v-img :src="logo" width="120"></v-img>
        </v-app-bar-title>

        <v-menu
          v-for="(menuItem, index) in menuItems"
          :key="index"
          v-model="activeMenu"
        >
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="mx-2" variant="text">
              {{ menuItem.title }}
            </v-btn>
          </template>

          <v-list v-if="activeMenu === index">
            <v-list-item
              v-for="(item, itemIndex) in menuItem.items"
              :key="itemIndex"
              :to="item.route"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-container>
    </v-app-bar>
  </div>
</template>

<script setup>
/*
 * TODO
 * --navigatie menu items fixen
 * --menu item layout veranderen
 */

import { ref } from 'vue';
import logo from '@/assets/PTI-logo_landscape.svg';

const activeMenu = ref(null);
// const closeTimeout = ref(null);
const menuItems = ref([
  {
    title: 'Branches',
    items: [
      { title: 'Bouw en Vastgoed', icon: 'mdi-view-grid', route: '/' },
      { title: 'IT en ITES', icon: 'mdi-shape', route: '/' },
      { title: 'Gezondheidszorg', icon: 'mdi-new-box', route: '/' },
      { title: 'Productie', icon: 'mdi-tag', route: '/' },
      { title: 'Vervoer en Logistiek', icon: 'mdi-view-grid', route: '/' },
    ],
  },
  {
    title: 'Modules',
    items: [
      { title: 'Werkorderbeheer', icon: 'mdi-view-grid', route: '/' },
      { title: 'Gebruikersbeheer', icon: 'mdi-shape', route: '/' },
      { title: 'Procesbeheer', icon: 'mdi-view-grid', route: '/' },
      { title: 'Projectbeheer', icon: 'mdi-tag', route: '/' },
      { title: 'Planning', icon: 'mdi-new-box', route: '/' },
      { title: 'Verdeeltool', icon: 'mdi-view-grid', route: '/' },
      { title: 'Klantenportaal', icon: 'mdi-view-grid', route: '/' },
      { title: 'Klantcommunicatie', icon: 'mdi-view-grid', route: '/' },
    ],
  },
  {
    title: 'Tarieven',
    items: [
      { title: 'Calculator', icon: 'mdi-view-grid', route: '/' },
      { title: 'Lorem', icon: 'mdi-shape', route: '/' },
      { title: 'Lorem', icon: 'mdi-new-box', route: '/' },
    ],
  },
]);

// const activeMenuItems = computed(() =>
//   activeMenu.value !== null ? menuItems.value[activeMenu.value].items : []
// );
// const openMenu = (index) => {
//   clearTimeout(closeTimeout.value);
//   activeMenu.value = index;
// };
// const closeMenu = () => {
//   closeTimeout.value = setTimeout(() => {
//     activeMenu.value = null;
//   }, 150);
// };
// const keepMenuOpen = () => clearTimeout(closeTimeout.value);
</script>
