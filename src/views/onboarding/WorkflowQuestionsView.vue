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
          />
          <v-select
            v-model="workflow.confirmAppointment"
            label="Moet de klant de afspraak bevestigen?"
            :items="['Ja', 'Nee']"
            :rules="[required]"
          />
          <v-select
            v-model="workflow.followUp"
            label="Automatische opvolging als de klant niet reageert?"
            :items="['Ja', 'Nee']"
            :rules="[required]"
          />
          <v-select
            v-model="workflow.revisit"
            label="Moeten vervolgbezoeken worden ingepland?"
            :items="['Ja', 'Nee']"
            :rules="[required]"
          />

          <!-- Klantcommunicatie -->
          <v-subheader class="mt-5">Klantcommunicatie</v-subheader>
          <v-divider class="mb-3" />

          <v-select
            v-model="workflow.reminders"
            label="Wil je herinneringen sturen voorafgaand aan de afspraak?"
            :items="['Ja', 'Nee']"
            :rules="[required]"
          />
          <v-select
            v-model="workflow.afterMessage"
            label="Wat ontvangt de klant na afronding van de werkopdracht?"
            :items="['Samenvatting', 'Bevestiging', 'Geen bericht']"
            :rules="[required]"
          />

          <!-- Uitvoering -->
          <v-subheader class="mt-5">Uitvoering</v-subheader>
          <v-divider class="mb-3" />

          <v-select
            v-model="workflow.preInspection"
            label="Is een schouwing vereist vóór uitvoering?"
            :items="['Ja', 'Nee']"
            :rules="[required]"
          />
          <v-select
            v-model="workflow.qcAfter"
            label="Moet er een kwaliteitscontrole of goedkeuring volgen?"
            :items="['Ja', 'Nee']"
            :rules="[required]"
          />

          <!-- Sluiting werkopdracht -->
          <v-subheader class="mt-5">Sluiting van de werkopdracht</v-subheader>
          <v-divider class="mb-3" />

          <v-text-field
            v-model="workflow.autoCloseDays"
            label="Na hoeveel dagen moet een opdracht automatisch worden gesloten?"
            type="number"
            :rules="[required]"
          />
        </v-form>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="snackbar" :timeout="3000" :color="snackbarColor">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>

  <v-container v-else>
    <v-progress-circular color="primary" indeterminate />
  </v-container>
</template>

<script setup>
import { ref, defineExpose, defineEmits } from 'vue';
import { auth, db } from '@/firebase';
import { ref as dbRef, set, get } from 'firebase/database';

const emit = defineEmits(['notify']);

const user = auth.currentUser;
const formRef = ref(null);
const valid = ref(false);

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

if (user) {
  const refPath = dbRef(db, `workflow/${user.uid}`);
  get(refPath).then((snapshot) => {
    if (snapshot.exists()) {
      workflow.value = snapshot.val();
    }
  });
}

const snackbar = ref(false);
const snackbarText = ref('');
const snackbarColor = ref('success');

defineExpose({ submit });
</script>
