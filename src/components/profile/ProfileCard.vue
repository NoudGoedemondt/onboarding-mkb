<template>
  <v-card class="pa-5 mx-auto" max-width="600">
    <v-card-title> Profielgegevens </v-card-title>

    <v-card-text>
      <v-text-field
        label="Voornaam"
        v-model="profile.firstName"
        :disabled="!isEditing"
      ></v-text-field>

      <v-text-field
        label="Achternaam"
        v-model="profile.lastName"
        :disabled="!isEditing"
      ></v-text-field>

      <v-text-field
        label="E-mail"
        v-model="profile.email"
        :disabled="true"
      ></v-text-field>
    </v-card-text>

    <v-card-actions class="d-flex justify-end">
      <v-btn color="primary" @click="toggleEdit">
        <v-icon left>{{ isEditing ? 'mdi-check' : 'mdi-pencil' }}</v-icon>
        {{ isEditing ? 'Opslaan' : 'Bewerken' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import { getAuth, updateProfile } from 'firebase/auth';

const auth = getAuth();
const emit = defineEmits(['notify']);

const isEditing = ref(false);

const profile = ref({
  firstName: '',
  lastName: '',
  email: '',
});

const toggleEdit = async () => {
  if (isEditing.value) {
    await saveProfile();
  }
  isEditing.value = !isEditing.value;
};

const saveProfile = async () => {
  const user = auth.currentUser;
  const displayName = `${profile.value.firstName} ${profile.value.lastName}`;
  try {
    await updateProfile(user, { displayName });
    emit('notify', 'Profielgegevens opgeslagen');
  } catch (err) {
    emit('notify', 'Fout bij opslaan profiel: ', err.message);
  }
};

onMounted(() => {
  const user = auth.currentUser;
  if (user) {
    const [firstName, ...lastParts] = (user.displayName || '').split(' ');
    profile.value.firstName = firstName;
    profile.value.lastName = lastParts.join(' ');
    profile.value.email = user.email;
  }
});
</script>
