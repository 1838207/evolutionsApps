import { createApp } from "vue";
import { createPinia } from 'pinia';
import App from './App.vue';
import { Participant } from "../common/participant";

import router from './router';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light',
    }
});

interface ApiResponse {
    success: boolean;
    error?: string;
}

declare global {
    interface Window {
        api: {
            // Méthode send dont le premier paramètre est un string 
            // Second paramètre de la méthode send utilise l'opérateur de décomposition pour accepter un nombre variable d'arguments
            // Second paramètre est un tableau de n'importe quel type
            send: (channel: string, ...args: any[]) => void;
            // Méthode on dont le premier paramètre est un string
            // Second paramètre de la méthode on est la fonction listener: prend un événement et un nombre variable d'arguments
            on: (channel: string, listener: (event: any, ...args: any[]) => void) => void;

            // Méthode chargerParticipants qui retourne une promesse d'ApiResponse
            chargerParticipants: () => Promise<ApiResponse & { data?: Participant[] }>;

            ajouterParticipant: (participant: Participant) => Promise<ApiResponse>;

            showMessageBox: (options: any) => Promise<any>;
            supprimerParticipant: (matricule:number) => Promise<ApiResponse>;

            once: (channel: string, callback: (event: any, data: any) => void) => void;

            modifierParticipant: (participant: Participant) => Promise<ApiResponse>
        };
    }
}

// Utilisation du routeur dans l'application Vue
const app = createApp(App);

// Créer une instance de Pinia
const pinia = createPinia();

app.use(pinia); // Utiliser Pinia avant router

app.use(router);
app.use(vuetify);
app.mount('#app');