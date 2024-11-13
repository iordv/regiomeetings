// Configuratie - vervang deze waarden met je eigen gegevens
const AIRTABLE_PERSONAL_ACCESS_TOKEN = 'patb2R2zNZYax7KbJ.b60320190d21f3c712fb14052da0cf91668ba87a0be1a4c2ce261d891aa706ab';
const BASE_ID = 'appZ4VUu6DqSLn6Pf/tbl4N0bDeLOUUzEDQ/viw6vBQowJEokGSVc';
const TABLE_NAME = 'Table%201'; // Let op de URL-encoding voor spaties (%20)

// Endpoint voor Airtable API
const endpoint = `https://api.airtable.com/v0/${appZ4VUu6DqSLn6Pf/tbl4N0bDeLOUUzEDQ/viw6vBQowJEokGSVc}/${Table%201}`;

// Headers voor API-verzoeken
const headers = {
    'Authorization': `Bearer ${patb2R2zNZYax7KbJ.b60320190d21f3c712fb14052da0cf91668ba87a0be1a4c2ce261d891aa706ab}`,
    'Content-Type': 'application/json'
};

// Functie om een nieuwe meeting toe te voegen
async function addMeeting(meeting) {
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ fields: meeting })
    });
    return response.json();
}

// Functie om alle meetings op te halen
async function fetchMeetings() {
    const response = await fetch(endpoint + '?sort[0][field]=Datum&sort[0][direction]=asc', {
        headers: headers
    });
    return response.json();
}

// Functie om een meeting te verwijderen
async function deleteMeeting(recordId) {
    const response = await fetch(`${endpoint}/${recordId}`, {
        method: 'DELETE',
        headers: headers
    });
    return response.json();
}

// Formulier submit event handler
document.getElementById('meetingForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const meeting = {
        Consultant: document.getElementById('Consultant').value,
        Datum: document.getElementById('Datum').value,
        Tijd: document.getElementById('Tijd').value,
        Locatie: document.getElementById('Locatie').value,
        Opmerkingen: document.getElementById('Opmerkingen').value
    };

    await addMeeting(meeting);
    document.getElementById('meetingForm').reset();
    displayMeetings();
});

// Functie om meetings weer te geven op de pagina
async function displayMeetings() {
    const data = await fetchMeetings();
    const meetingsList = document.getElementById('meetingsList');
    meetingsList.innerHTML = '';

    data.records.forEach(record => {
        const meeting = record.fields;
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${meeting.Consultant || ''}</td>
            <td>${meeting.Datum || ''}</td>
            <td>${meeting.Tijd || ''}</td>
            <td>${meeting.Locatie || ''}</td>
            <td>${meeting.Opmerkingen || ''}</td>
            <td class="action-buttons">
                <button onclick="deleteMeetingRecord('${record.id}')">Verwijderen</button>
            </td>
        `;
        meetingsList.appendChild(tr);
    });
}

// Functie om een meeting te verwijderen en de tabel te verversen
async function deleteMeetingRecord(recordId) {
    if (confirm('Weet je zeker dat je deze meeting wilt verwijderen?')) {
        await deleteMeeting(recordId);
        displayMeetings();
    }
}

// Laad de meetings bij het openen van de pagina
displayMeetings();

// Optioneel: ververst de meetings elke minuut
setInterval(displayMeetings, 60000);
