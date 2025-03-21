<template>
  <v-container>
    <v-card v-if="hasProfileInfo" class="pa-5 mx-auto" max-width="600">
      <v-card-title> Profielgegevens </v-card-title>

      <v-card-text>
        <!-- Voornaam veld -->
        <v-text-field
          label="Voornaam"
          v-model="profile.firstName"
          :readonly="!isEditing"
          :disabled="!isEditing"
        ></v-text-field>

        <!-- Achternaam veld -->
        <v-text-field
          label="Achternaam"
          v-model="profile.lastName"
          :readonly="!isEditing"
          :disabled="!isEditing"
        ></v-text-field>

        <!-- E-mail veld -->
        <v-text-field
          label="E-mail"
          v-model="profile.email"
          :readonly="!isEditing"
          :disabled="!isEditing"
        ></v-text-field>
      </v-card-text>

      <v-card-actions class="d-flex justify-end">
        <v-btn color="primary" @click="toggleEdit">
          <v-icon left>{{ isEditing ? 'mdi-check' : 'mdi-pencil' }}</v-icon>
          {{ isEditing ? 'Opslaan' : 'Bewerken' }}
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card v-if="hasCompanyInfo" class="pa-5 mx-auto" max-width="600">
      <v-card-title> Bedrijfsgegevens </v-card-title>

      <v-card-text>
        <!-- Bedrijfsnaam veld -->
        <v-text-field
          label="Bedrijfsnaam"
          v-model="company.name"
          :readonly="!isEditing"
          :disabled="!isEditing"
        ></v-text-field>

        <!-- Adres veld -->
        <v-text-field
          label="Adres"
          v-model="company.adress"
          :readonly="!isEditing"
          :disabled="!isEditing"
        ></v-text-field>

        <!-- Postcode & Plaats veld -->
        <v-row>
          <v-col>
            <v-text-field
              label="Postcode"
              v-model="company.zip"
              :readonly="!isEditing"
              :disabled="!isEditing"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              label="Plaats"
              v-model="company.city"
              :readonly="!isEditing"
              :disabled="!isEditing"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="d-flex justify-end">
        <v-btn color="primary" @click="toggleEdit">
          <v-icon left>{{ isEditing ? 'mdi-check' : 'mdi-pencil' }}</v-icon>
          {{ isEditing ? 'Opslaan' : 'Bewerken' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref as dbRef, onValue } from 'firebase/database';
import { db } from '@/firebase';

const auth = getAuth();
const route = useRouter();

const user = ref(null);
const isEditing = ref(false);
const hasProfileInfo = ref(false);
const hasCompanyInfo = ref(false);
const profile = ref({
  firstName: '',
  lastName: '',
  email: '',
});
const company = ref({
  name: '',
  adress: '',
  zip: '',
  city: '',
});

const toggleEdit = () => {
  if (isEditing.value) {
    // Hier zou je de data opslaan (bijvoorbeeld naar Firebase)
    console.log('Opgeslagen profiel:', profile.value);
  }
  isEditing.value = !isEditing.value;
};

const getFirstAndLastName = (fullName) => {
  const nameList = fullName.split(' ');
  return {
    firstName: nameList[0] || '',
    lastName: nameList.slice(1).join(' ') || '',
  };
};

const getCompanyData = (userId) => {
  const userRef = dbRef(db, `companies/${userId}`);

  onValue(userRef, (snapshot) => {
    if (snapshot.exists()) {
      hasCompanyInfo.value = true;

      company.value.name = snapshot.val().name;
      company.value.adress = snapshot.val().address;
      company.value.zip = snapshot.val().zip;
      company.value.city = snapshot.val().city;
    } else {
      hasCompanyInfo.value = false;
      console.log('No company data found');
    }
  });
};

onMounted(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      user.value = currentUser;
      hasProfileInfo.value = true;

      const { firstName, lastName } = getFirstAndLastName(
        currentUser.displayName || ''
      );

      profile.value.firstName = firstName;
      profile.value.lastName = lastName;
      profile.value.email = currentUser.email;

      getCompanyData(currentUser.uid);
    } else {
      hasProfileInfo.value = false;
      hasCompanyInfo.value = false;

      route.push('/');
      console.log('User logged out');
    }
  });

  onUnmounted(() => {
    unsubscribe();
  });
});
</script>
