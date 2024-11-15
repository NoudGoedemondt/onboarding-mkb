<template>
  <div>
    <v-expand-transition>
      <v-app-bar :height="activeMenuItemIndex !== null ? 280 : 64">
        <v-container max-width="70vw" class="top-container d-flex align-center">
          <v-app-bar-title>
            <v-img :src="logo" width="120"></v-img>
          </v-app-bar-title>

          <v-btn
            v-for="(items, index) in menuItems"
            :key="index"
            @click="setActiveMenuItemIndex(index)"
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
              <v-list-item :to="subItems.route" class="px-2">
                <template v-slot:prepend>
                  <v-icon :icon="subItems.icon"></v-icon>
                </template>
                <v-list-item-title>{{ subItems.title }}</v-list-item-title>
              </v-list-item>
            </v-col>
          </v-row>
        </v-container>
      </v-app-bar>
    </v-expand-transition>
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
