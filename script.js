// Importar as funções necessárias do SDK do Firebase
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCHSIQwOOfVicZ40zBkqMQunSTK6hc-KhE",
  authDomain: "calendario-9abc7.firebaseapp.com",
  projectId: "calendario-9abc7",
  storageBucket: "calendario-9abc7.firebasestorage.app",
  messagingSenderId: "788638245790",
  appId: "1:788638245790:web:4d485d3a2f0dcf9238ac8f"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true,
        select: async function(info) {
            const title = prompt('Nome do evento:');
            if (title) {
                const eventData = {
                    title: title,
                    start: info.startStr,
                    end: info.endStr,
                    allDay: info.allDay,
                    room: currentRoom
                };
                calendar.addEvent(eventData);
                await saveEvent(eventData);
            }
            calendar.unselect();
        },
        events: async function(fetchInfo, successCallback, failureCallback) {
            const events = await loadRoomEvents(currentRoom);
            successCallback(events);
        }
    });
    calendar.render();

    let currentRoom = 'Sala Empreendedorismo'; // Sala padrão

    document.getElementById('empreendedorismoBtn').addEventListener('click', async () => {
        console.log('Botão Sala Empreendedorismo clicado');
        currentRoom = 'Sala Empreendedorismo';
        const events = await loadRoomEvents(currentRoom);
        calendar.removeAllEvents();
        calendar.addEventSource(events);
    });

    document.getElementById('evolutionBtn').addEventListener('click', async () => {
        console.log('Botão Sala Evolution clicado');
        currentRoom = 'Sala Evolution';
        const events = await loadRoomEvents(currentRoom);
        calendar.removeAllEvents();
        calendar.addEventSource(events);
    });

    async function saveEvent(event) {
        try {
            await addDoc(collection(db, "reservations"), event);
            console.log('Reserva salva com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar reserva: ', error);
        }
    }

    async function loadRoomEvents(room) {
        console.log(`Carregando eventos para ${room}`);
        const q = query(collection(db, "reservations"), where("room", "==", room));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data());
    }

    // Carregar eventos da sala padrão
    loadRoomEvents(currentRoom).then(events => {
        calendar.addEventSource(events);
    });
});