<template>
  <div>
    <v-app-bar :elevation="hasDropShadow ? 4 : 0">
      <v-app-bar-title>My App</v-app-bar-title>

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
    </v-app-bar>

    <!-- Expanding menu panel -->
    <v-expand-transition>
      <v-sheet
        v-if="activeMenu !== null"
        class="expanding-menu"
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
              <v-list-item
                :to="item.route"
                link
                class="menu-item"
                color="primary"
              >
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

<script>
//TODO: convert naar composition api
//TODO: menu items zijn stuk, maak bestaande routes
//TODO: menu item lay out is stuk

export default {
  data: () => ({
    activeMenu: null,
    closeTimeout: null,
    hasDropShadow: true,
    menuItems: [
      {
        title: 'Products',
        items: [
          { title: 'All Products', icon: 'mdi-view-grid', route: '/products' },
          { title: 'Categories', icon: 'mdi-shape', route: '/categories' },
          { title: 'New Arrivals', icon: 'mdi-new-box', route: '/new' },
          { title: 'Special Offers', icon: 'mdi-tag', route: '/offers' },
        ],
      },
      {
        title: 'Services',
        items: [
          {
            title: 'Consulting',
            icon: 'mdi-account-tie',
            route: '/consulting',
          },
          { title: 'Support', icon: 'mdi-help-circle', route: '/support' },
          { title: 'Training', icon: 'mdi-school', route: '/training' },
        ],
      },
      {
        title: 'Company',
        items: [
          { title: 'About Us', icon: 'mdi-information', route: '/about' },
          { title: 'Contact', icon: 'mdi-email', route: '/contact' },
          { title: 'Careers', icon: 'mdi-briefcase', route: '/careers' },
        ],
      },
    ],
  }),

  computed: {
    activeMenuItems() {
      return this.activeMenu !== null
        ? this.menuItems[this.activeMenu].items
        : [];
    },
  },

  methods: {
    openMenu(index) {
      clearTimeout(this.closeTimeout);
      this.activeMenu = index;
      this.hasDropShadow = false;
    },
    closeMenu() {
      this.closeTimeout = setTimeout(() => {
        this.activeMenu = null;
        this.hasDropShadow = true;
      }, 150);
    },
    keepMenuOpen() {
      clearTimeout(this.closeTimeout);
    },
  },
};
</script>

<style scoped>
.expanding-menu {
  position: absolute;
  top: 64px; /* Height of v-app-bar */
  left: 0;
  right: 0;
  background-color: rgb(var(--v-theme-surface));
  z-index: 100;
}

.menu-item {
  transition: background-color 0.2s;
  border-radius: 4px;
}

.menu-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.1);
}
</style>
