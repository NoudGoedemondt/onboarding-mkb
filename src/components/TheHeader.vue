<template>
  <div>
    <v-app-bar>
      <v-container max-width="70vw" class="d-flex align-center">
        <v-app-bar-title>
          <v-img :src="logo" width="120"></v-img>
        </v-app-bar-title>

        <div class="d-flex align-center">
          <v-btn
            v-for="(menuItem, index) in menuItems"
            :key="index"
            class="mx-2"
            variant="text"
            @mouseenter="openMenu(index)"
            @mouseleave="closeMenu"
          >
            {{ menuItem.title }}
            <v-icon right>
              {{ activeMenu === index ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
            </v-icon>
          </v-btn>
        </div>
      </v-container>
    </v-app-bar>

    <!-- Expanding menu panel -->
    <v-expand-transition>
      <v-sheet
        v-if="activeMenu !== null"
        class="position-absolute left-0 right-0"
        style="top: 80px; z-index: 10"
        @mouseenter="keepMenuOpen"
        @mouseleave="closeMenu"
      >
        <v-list class="pa-4">
          <v-row>
            <v-col
              v-for="(item, index) in activeMenuItems"
              :key="index"
              cols="3"
            >
              <v-list-item :to="item.route" link>
                <template v-slot:prepend>
                  <v-icon>{{ item.icon }}</v-icon>
                </template>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-col>
          </v-row>
        </v-list>
      </v-sheet>
    </v-expand-transition>
  </div>
</template>

<script setup>
//TODO: menu items zijn stuk, maak bestaande routes
//TODO: menu item lay out is stuk

import { ref, computed } from 'vue';
import logo from '@/assets/PTI-logo_landscape.svg';

const activeMenu = ref(null);
const closeTimeout = ref(null);
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

const activeMenuItems = computed(() =>
  activeMenu.value !== null ? menuItems.value[activeMenu.value].items : []
);
const openMenu = (index) => {
  clearTimeout(closeTimeout.value);
  activeMenu.value = index;
};
const closeMenu = () => {
  closeTimeout.value = setTimeout(() => {
    activeMenu.value = null;
  }, 150);
};
const keepMenuOpen = () => clearTimeout(closeTimeout.value);
</script>
