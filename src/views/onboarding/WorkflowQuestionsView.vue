<template>
  <v-container v-if="user">
    <v-card class="pa-5 mx-auto" max-width="700">
      <v-card-text>
        <v-form ref="formRef" v-model="valid" lazy-validation>
          <!-- Afspraakbeheer -->
          <v-subheader>Afspraakbeheer</v-subheader>
          <v-divider class="mb-3" />

          <v-select
            v-model="workflow.selfSchedule"
            label="Mag de klant zelf een afspraak inplannen?"
            :items="['Ja', 'Nee']"
            :rules="[required]"
            required
            :loading="loading"
            :disabled="loading"
          />
          <v-select
            v-model="workflow.confirmAppointment"
            label="Moet de klant de afspraak bevestigen?"
            :items="['Ja', 'Nee']"
            :rules="[required]"
            required
            :loading="loading"
            :disabled="loading"
          />
          <v-select
            v-model="workflow.followUp"
            label="Automatische opvolging als de klant niet reageert?"
            :items="['Ja', 'Nee']"
            :rules="[required]"
            required
            :loading="loading"
            :disabled="loading"
          />
          <v-select
            v-model="workflow.revisit"
            label="Moeten vervolgbezoeken worden ingepland?"
            :items="['Ja', 'Nee']"
            :rules="[required]"
            required
            :loading="loading"
            :disabled="loading"
          />

          <!-- Klantcommunicatie -->
          <v-subheader class="mt-5">Klantcommunicatie</v-subheader>
          <v-divider class="mb-3" />

          <v-select
            v-model="workflow.reminders"
            label="Wil je herinneringen sturen voorafgaand aan de afspraak?"
            :items="['Ja', 'Nee']"
            :rules="[required]"
            required
            :loading="loading"
            :disabled="loading"
          />
          <v-select
            v-model="workflow.afterMessage"
            label="Wat ontvangt de klant na afronding van de werkopdracht?"
            :items="['Samenvatting', 'Bevestiging', 'Geen bericht']"
            :rules="[required]"
            required
            :loading="loading"
            :disabled="loading"
          />

          <!-- Uitvoering -->
          <v-subheader class="mt-5">Uitvoering</v-subheader>
          <v-divider class="mb-3" />

          <v-select
            v-model="workflow.preInspection"
            label="Is een schouwing vereist vóór uitvoering?"
            :items="['Ja', 'Nee']"
            :rules="[required]"
            required
            :loading="loading"
            :disabled="loading"
          />
          <v-select
            v-model="workflow.qcAfter"
            label="Moet er een kwaliteitscontrole of goedkeuring volgen?"
            :items="['Ja', 'Nee']"
            :rules="[required]"
            required
            :loading="loading"
            :disabled="loading"
          />

          <!-- Sluiting werkopdracht -->
          <v-subheader class="mt-5">Sluiting van de werkopdracht</v-subheader>
          <v-divider class="mb-3" />

          <v-text-field
            v-model="workflow.autoCloseDays"
            label="Na hoeveel dagen moet een opdracht automatisch worden gesloten?"
            type="number"
            :rules="[required]"
            required
            :loading="loading"
            :disabled="loading"
          />
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>

  <v-container v-else> Geen gebruiker gevonden. Log in. </v-container>
</template>

<script setup>
import { ref, defineExpose, defineEmits, onMounted } from 'vue';
import { auth, db } from '@/firebase';
import { ref as dbRef, set, get } from 'firebase/database';

const emit = defineEmits(['notify']);

const user = auth.currentUser;
const formRef = ref(null);
const valid = ref(false);
const loading = ref(true);

const workflow = ref({
  selfSchedule: '',
  confirmAppointment: '',
  followUp: '',
  revisit: '',
  reminders: '',
  afterMessage: '',
  preInspection: '',
  qcAfter: '',
  autoCloseDays: '',
});

const required = (v) => !!v || 'Dit veld is verplicht';

const submit = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid?.valid || !user) return false;

  try {
    const refPath = dbRef(db, `workflow/${user.uid}`);
    await set(refPath, workflow.value);
    emit('notify', 'Workflowvragen succesvol opgeslagen!');
    return true;
  } catch (e) {
    console.error('Fout bij opslaan workflowvragen:', e);
    emit('notify', 'Fout bij opslaan workflowvragen', 'error');
    return false;
  }
};

onMounted(() => {
  if (user) {
    const refPath = dbRef(db, `workflow/${user.uid}`);
    get(refPath)
      .then((snapshot) => {
        if (snapshot.exists()) {
          workflow.value = snapshot.val();
        }
      })
      .catch((err) => {
        console.error('Fout bij ophalen workflowdata:', err.message);
      })
      .finally(() => {
        loading.value = false;
      });
  }
});

defineExpose({ submit });
</script>
