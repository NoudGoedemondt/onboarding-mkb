<template>
  <div class="position-relative" :style="{ minHeight: `${heroHeight}` }">
    <v-sheet
      :style="{
        backgroundImage: `url(${waveCard})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        zIndex: '0',
      }"
    >
    </v-sheet>

    <v-container
      class="position-relative h-100"
      :style="{
        zIndex: 1,
      }"
      fluid
    >
      <v-row
        align="center"
        justify="center"
        :style="{ minHeight: `${heroHeight}` }"
      >
        <v-card
          class="py-4 mr-10 rounded-lg"
          max-width="650px"
          :style="{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }"
          flat
        >
          <v-img width="400" :src="planningSuiteLogo" class="ml-1"></v-img>

          <v-card-text>
            <p class="text-body-1 mb-4">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Officia
              doloremque molestiae qui dicta debitis maiores tempora unde
              similique. Ratione, voluptate?
            </p>
          </v-card-text>

          <v-card-actions class="pa-6 pt-0">
            <v-btn
              size="large"
              color="purple"
              class="text-body-1 px-6"
              variant="elevated"
            >
              Get Started
            </v-btn>
            <v-btn
              size="large"
              class="text-body-1 px-6 ml-4"
              variant="outlined"
            >
              Learn More
            </v-btn>
          </v-card-actions>
        </v-card>

        <img :src="ctaMockUp" width="600" height="auto" />
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import ctaMockUp from '@/assets/CTA-mock-up-1024x692.webp';
import waveCard from '@/assets/wave-card-grid-w.webp';
import planningSuiteLogo from '@/assets/pti-logo-wide.svg';

const heroHeight = '650px';
</script>
