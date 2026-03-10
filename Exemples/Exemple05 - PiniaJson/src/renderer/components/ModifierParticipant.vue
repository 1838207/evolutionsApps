<template>
  <v-container>
    <v-form @submit.prevent="submitForm" ref="formRef">
      <v-text-field v-model="editedParticipant.matricule" label="Matricule" type="number" disabled />
      <v-text-field v-model="editedParticipant.prenom" label="Prénom" required />
      <v-text-field v-model="editedParticipant.nom" label="Nom" required />

      <v-select
        v-model="editedParticipant.genre"
        :items="['M', 'F']"
        label="Genre"
        required
      />

      <v-select
        v-model="editedParticipant.niveau"
        :items="['Débutant', 'Intermédiaire', 'Professionnel']"
        label="Niveau"
        required
      />

      <v-text-field v-model="editedParticipant.email" label="Courriel" type="email" required />

      <v-switch v-model="editedParticipant.isActif" label="Actif" />

      <pre>{{ editedParticipant }}</pre>

      <v-btn type="submit" color="primary">Enregistrer les modifications</v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const formRef = ref()

import { Participant } from '../../common/participant'

// Copie locale pour éditer les données
const editedParticipant = ref<Participant>({
  matricule: 0,
  prenom: '',
  nom: '',
  genre: '',
  niveau: '',
  email: '',
  isActif: false,
})

// Au montage de la page, écouter l'évènement IPC avec le participant sélectionné
onMounted(()=> {
  // Écouter 1 seule fois l'évènement 'selected-participant'
  window.api.once('selected-participant', (event: any, participant: Participant) => {
    if(participant){
      editedParticipant.value = { ...participant }
      console.log(participant);
    }
  })
})


async function submitForm() {
  try {
    const plainParticipant = JSON.parse(JSON.stringify(editedParticipant.value))

    // Appeler l'API pour modifier le participant
    const result = await window.api.modifierParticipant(plainParticipant)
    
    if (result.success) {
      // Afficher un message de succès
      await window.api.showMessageBox({
        type: "info",
        title: "Modification",
        message: `Participant ${ editedParticipant.value.prenom } modifié avec succès.`,
      });
      
      // Fermer la fenêtre après succès
      window.close()
    } else {
      // Afficher un message d'erreur
      await window.api.showMessageBox({
        type: "error",
        title: "Erreur de modification",
        message: `Erreur lors de la modification: ${result.error}`,
      });
    }
  } catch (error) {
    console.error('Erreur lors de la modification du participant:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    window.api.showMessageBox({
      type: "error",
      title: "Erreur",
      message: `Une erreur est survenue: ${errorMessage}`,
    });
  }
}


</script>