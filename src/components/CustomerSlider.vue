<template>
  <v-card class="mx-auto mt-10" max-width="70vw" flat>
    <v-card-title class="text-center text-h4">Onze Klanten</v-card-title>

    <v-slide-group show-arrows="always" :key="customerImages.length">
      <v-slide-group-item
        v-for="(image, index) in customerImages"
        :key="index"
        class="d-flex align-center justify-center"
      >
        <v-img
          :src="image"
          width="200px"
          height="150px"
          contain
          class="mx-5"
        ></v-img>
      </v-slide-group-item>
    </v-slide-group>
  </v-card>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const customerImages = ref([]);

onMounted(() => {
  const images = require.context('@/assets/customers', false, /\.png$/);
  customerImages.value = images.keys().map((key) => images(key));
});
</script>
