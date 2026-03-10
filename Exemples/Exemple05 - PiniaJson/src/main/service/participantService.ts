import { Participant } from "../../common/participant";
import { promises as fs } from 'fs';
import path from 'path';
import { ipcMain, app } from 'electron';

export class ParticipantService {
    private participantsFilePath : string;

    constructor() {
        const dataDir = path.join(app.getAppPath(), 'data');
        this.participantsFilePath = path.join(dataDir, 'participants.json');
    }


    private async lireParticipants(): Promise<Participant[]> {
        try {
            const data = await fs.readFile(this.participantsFilePath, 'utf-8');
            const participants = JSON.parse(data);
            return participants.map((p: any) => new Participant(p));
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                // Si le fichier n'existe pas, retourner une liste vide
                console.warn(`Fichier ${this.participantsFilePath} non trouvé. Création d'une liste vide.`);
                return [];
            }
            throw error;
        }
    }

    // Méthode pour charger les participants, utilisée par le renderer process via IPC
    public async chargerParticipants(): Promise<Participant[]> {
        return await this.lireParticipants();
    }

    public registerIpcHandlers(): void {
        ipcMain.handle('Canal-ChargerParticipants', async () => {
            return await this.chargerParticipants();
        });
    }

    // Méthode pour ajouter un nouveau participant
    public async ajouterParticipant(participant: Participant): Promise<void> {
        const participants = await this.lireParticipants();

        participants.push(participant);
        await this.ecrireParticipants(participants);
    }

    private async ecrireParticipants(participants: Participant[]): Promise<void> {
        const data = JSON.stringify(participants, null, 2);
        await fs.writeFile(this.participantsFilePath, data, 'utf-8');
    }

    // Pour supprimer un participant sélectionné dans le v-data-table
    public async supprimerParticipant(matricule:number): Promise<void> {

        const participants = await this.lireParticipants();

        const index = participants.findIndex(p=> p.matricule === matricule)

        if(index !== -1) {
            participants.splice(index, 1); // supprimer 1 élément à partir de l'index donnée
            await this.ecrireParticipants(participants)
        } else{
            throw new Error(`Participant avec matricule ${matricule} introuvable.`);
        }

    }

    public async modifierParticipant(updated: Partial<Participant>): Promise<void> {
    
        const participants = await this.lireParticipants()

        const index = participants.findIndex(p => p.matricule === updated.matricule)
        if (index !== -1) {
            participants[index] = { ...participants[index], ...updated }
            await this.ecrireParticipants(participants)
    } else {
      throw new Error(`Participant avec matricule ${updated.matricule} introuvable`)
    }
  }


}