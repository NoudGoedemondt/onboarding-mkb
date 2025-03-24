<template>
  <v-container v-if="hasProfileInfo">
    <v-card class="pa-5 mx-auto" max-width="600">
      <v-card-title> Profielgegevens </v-card-title>

      <v-card-text>
        <!-- Voornaam veld -->
        <v-text-field
          label="Voornaam"
          v-model="profile.firstName"
          :disabled="!isEditingProfile"
        ></v-text-field>

        <!-- Achternaam veld -->
        <v-text-field
          label="Achternaam"
          v-model="profile.lastName"
          :disabled="!isEditingProfile"
        ></v-text-field>

        <!-- E-mail veld -->
        <v-text-field
          label="E-mail"
          v-model="profile.email"
          :disabled="true"
        ></v-text-field>
      </v-card-text>

      <v-card-actions class="d-flex justify-end">
        <v-btn color="primary" @click="toggleEditProfile">
          <v-icon left>{{
            isEditingProfile ? 'mdi-check' : 'mdi-pencil'
          }}</v-icon>
          {{ isEditingProfile ? 'Opslaan' : 'Bewerken' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>

  <v-container v-if="hasCompanyInfo">
    <v-card class="pa-5 mx-auto" max-width="600">
      <v-card-title> Bedrijfsgegevens </v-card-title>

      <v-card-text>
        <!-- Bedrijfsnaam veld -->
        <v-text-field
          label="Bedrijfsnaam"
          v-model="company.name"
          :disabled="!isEditingCompany"
        ></v-text-field>

        <!-- Adres veld -->
        <v-text-field
          label="Adres"
          v-model="company.address"
          :disabled="!isEditingCompany"
        ></v-text-field>

        <!-- Postcode & Plaats veld -->
        <v-row>
          <v-col>
            <v-text-field
              label="Postcode"
              v-model="company.zip"
              :disabled="!isEditingCompany"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              label="Plaats"
              v-model="company.city"
              :disabled="!isEditingCompany"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="d-flex justify-end">
        <v-btn color="primary" @click="toggleEditCompany">
          <v-icon left>{{
            isEditingCompany ? 'mdi-check' : 'mdi-pencil'
          }}</v-icon>
          {{ isEditingCompany ? 'Opslaan' : 'Bewerken' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>

  <v-snackbar v-model="snackbar" :timeout="3000" location="bottom center">
    {{ snackbarText }}
  </v-snackbar>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { ref as dbRef, onValue, off, set } from 'firebase/database';
import { db } from '@/firebase';

const auth = getAuth();
const router = useRouter();

const user = ref(null);

const isEditingProfile = ref(false);
const isEditingCompany = ref(false);

const hasProfileInfo = ref(false);
const hasCompanyInfo = ref(false);

const profile = ref({
  firstName: '',
  lastName: '',
  email: '',
});
const company = ref({
  name: '',
  address: '',
  zip: '',
  city: '',
});

const snackbar = ref(false);
const snackbarText = ref('');

let unsubscribeAuth = null;
let companyRef = null;

const toggleEditProfile = async () => {
  if (isEditingProfile.value) {
    await saveProfileToFirebase();
  }
  isEditingProfile.value = !isEditingProfile.value;
};

const toggleEditCompany = async () => {
  if (isEditingCompany.value) {
    await saveCompanyToFirebase();
  }
  isEditingCompany.value = !isEditingCompany.value;
};

const saveProfileToFirebase = async () => {
  if (!user.value) return;

  const displayName = `${profile.value.firstName} ${profile.value.lastName}`;

  try {
    await updateProfile(user.value, {
      displayName: displayName,
    });
    showSnackbar('Profielgegevens opgeslagen!');
  } catch (error) {
    showSnackbar('Fout bij opslaan profielgegevens.');
    console.error('Fout bij opslaan profiel:', error.message);
  }
};

const saveCompanyToFirebase = async () => {
  if (!user.value) return;

  const refPath = dbRef(db, `companies/${user.value.uid}`);
  try {
    await set(refPath, company.value);
    showSnackbar('Bedrijfsgegevens opgeslagen!');
  } catch (error) {
    showSnackbar('Fout bij opslaan bedrijfsgegevens.');
    console.error('Fout bij opslaan bedrijf:', error.message);
  }
};

const getFirstAndLastName = (fullName) => {
  const nameList = fullName.split(' ');
  return {
    firstName: nameList[0] || '',
    lastName: nameList.slice(1).join(' ') || '',
  };
};

const getCompanyData = (userId) => {
  const companyRef = dbRef(db, `companies/${userId}`);

  onValue(companyRef, (snapshot) => {
    if (snapshot.exists()) {
      hasCompanyInfo.value = true;

      company.value.name = snapshot.val().name;
      company.value.address = snapshot.val().address;
      company.value.zip = snapshot.val().zip;
      company.value.city = snapshot.val().city;
    } else {
      hasCompanyInfo.value = false;
      console.log('No company data found');
    }
  });
};

const showSnackbar = (message) => {
  snackbarText.value = message;
  snackbar.value = true;
};

onMounted(() => {
  unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
  });
});

watch(user, (newUser) => {
  if (newUser) {
    hasProfileInfo.value = true;

    const { firstName, lastName } = getFirstAndLastName(
      newUser.displayName || ''
    );
    profile.value.firstName = firstName;
    profile.value.lastName = lastName;
    profile.value.email = newUser.email;

    getCompanyData(newUser.uid);
  } else {
    hasProfileInfo.value = false;
    hasCompanyInfo.value = false;
    router.push('/login');
  }
});

onUnmounted(() => {
  if (unsubscribeAuth) {
    unsubscribeAuth();
  }
  if (companyRef) {
    off(companyRef);
  }
});
</script>
