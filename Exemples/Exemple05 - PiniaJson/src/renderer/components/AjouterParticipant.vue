<template>
  <v-container>
    <v-form @submit.prevent="submitForm" ref="formRef">
      <v-text-field v-model="newParticipant.matricule" label="Matricule" type="number" required />
      <v-text-field v-model="newParticipant.prenom" label="Prénom" required />
      <v-text-field v-model="newParticipant.nom" label="Nom" required />

      <v-select
        v-model="newParticipant.genre"
        :items="['M', 'F']"
        label="Genre"
        required
      />

      <v-select
        v-model="newParticipant.niveau"
        :items="['Débutant', 'Intermédiaire', 'Professionnel']"
        label="Niveau"
        required
      />

      <v-text-field v-model="newParticipant.email" label="Courriel" type="email" required />

      <v-switch v-model="newParticipant.isActif" label="Actif" />

      <v-btn type="submit" color="primary">Ajouter</v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useParticipantStore } from '../stores/participantStores'
import type { Participant } from '@/common/participant'

const store = useParticipantStore()
const formRef = ref()

const newParticipant = ref<Participant>({
  matricule: 0,
  prenom: '',
  nom: '',
  genre: '',
  niveau: '',
  email: '',
  isActif: true,
})

async function submitForm() {
  try {
    
    const result = await store.ajouterParticipant({ ...newParticipant.value})
    
    // Si l'ajout du participant à bien fonctionné
    if (result.success) {

	  await window.api.showMessageBox({
        type: "info",
        title: "Ajout",
        message: `Participant ${newParticipant.value.nom} ajouté avec succès`,
      });

      // Après l'ajout, reset du newParticipant
      newParticipant.value = {
        matricule: 0,
        prenom: '',
        nom: '',
        genre: '',
        niveau: '',
        email: '',
        isActif: true,
      }

      formRef.value?.reset()
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout du participant:', error)
  }
}
</script>

<style scoped>
</style>
