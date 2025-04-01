<template>
  <v-container v-if="user">
    <v-card class="pa-5 mx-auto" max-width="600">
      <v-card-text>
        <v-form ref="formRef" v-model="valid" lazy-validation>
          <!-- Gebruikstoepassing -->
          <v-select
            v-model="usage.purpose"
            label="Waarvoor wil je de applicatie gebruiken?"
            :items="purposes"
            :rules="[required]"
            required
          />

          <!-- Aantal gebruikers -->
          <v-radio-group
            v-model="usage.users"
            label="Hoeveel mensen gaan ermee werken?"
            :rules="[required]"
          >
            <v-radio label="1-5" value="1-5" />
            <v-radio label="6-10" value="6-10" />
            <v-radio label="11-25" value="11-25" />
            <v-radio label="Meer dan 25" value="25+" />
          </v-radio-group>

          <!-- Toelichting -->
          <v-textarea
            v-model="usage.notes"
            label="Toelichting (optioneel)"
            auto-grow
          />
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>

  <v-container v-else> Geen gebruiker gevonden. Log in. </v-container>
</template>

<script setup>
import { ref, defineExpose, defineEmits } from 'vue';
import { auth, db } from '@/firebase';
import { ref as dbRef, set, get } from 'firebase/database';

const emit = defineEmits(['notify']);

const user = auth.currentUser;

const valid = ref(false);
const formRef = ref(null);

const usage = ref({
  purpose: '',
  users: '',
  notes: '',
});

const purposes = [
  'Plannen van werk',
  'Communicatie met klanten',
  'Samenwerken met collega’s',
  'Workflow automatiseren',
  'Anders',
];

const required = (v) => !!v || 'Dit veld is verplicht';

const submit = async () => {
  const isValid = await formRef.value?.validate();
  if (!isValid?.valid || !user) return false;

  try {
    const usageRef = dbRef(db, `usageInfo/${user.uid}`);
    await set(usageRef, usage.value);
    emit('notify', 'Gebruik succesvol opgeslagen!');
    return true;
  } catch (e) {
    console.error('Fout bij opslaan:', e);
    emit('notify', 'Fout bij opslaan gebruiksinformatie', e.message);
    return false;
  }
};

if (user) {
  const usageRef = dbRef(db, `usageInfo/${user.uid}`);
  get(usageRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        usage.value = snapshot.val();
      }
    })
    .catch((error) => {
      console.error('Fout bij ophalen usageInfo:', error.message);
    });
}

defineExpose({ submit });
</script>
