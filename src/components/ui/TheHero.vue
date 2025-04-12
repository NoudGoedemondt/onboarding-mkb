<template>
  <v-sheet class="background">
    <v-container
      class="position-relative h-100"
      :style="{
        zIndex: 1,
      }"
      fluid
    >
      <v-row align="center" justify="center" style="margin-top: 200px">
        <v-card
          class="py-4 mr-10 rounded-lg"
          max-width="650px"
          :style="{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }"
          flat
        >
          <v-img width="400" :src="planningSuiteLogo" class="ml-1"></v-img>

          <v-card-text>
            <p class="text-body-1 mb-4">
              Een schaalbaar, secure en slim softwarepakket waarmee we de
              snelheid, efficiëntie en het gemak rondom jouw planning en
              uitvoering vergroten.
            </p>
          </v-card-text>

          <v-card-actions class="pa-6 pt-0">
            <v-btn
              size="large"
              color="primary"
              class="text-body-1 px-6"
              variant="elevated"
              to="/onboarding/company-info"
            >
              Probeer Gratis
            </v-btn>
            <v-btn
              size="large"
              class="text-body-1 px-6 ml-4"
              variant="outlined"
            >
              Lees Meer
            </v-btn>
          </v-card-actions>
        </v-card>

        <img :src="ctaMockUp" width="600" />
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup>
import ctaMockUp from '@/assets/pti/CTA-mock-up-1024x692.webp';
import planningSuiteLogo from '@/assets/pti/pti-logo-wide.svg';
</script>

<style scoped>
.background {
  height: calc(100vh - 64px);
  background: url('@/assets/pti/wave-card-grid-w.webp') no-repeat center center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
