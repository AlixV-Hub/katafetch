// On range les constantes au début
const CITYINPUT = document.querySelector("#cityInput");
const FETCHBUTTON = document.querySelector(".city-search button");
const CITYDISPLAY = document.querySelector("#city");
const COORDINATESDISPLAY = document.querySelector("#gps");
const TEMPERATUREDISPLAY = document.querySelector("#temperature");
const DETAILSDISPLAY = document.querySelector("#details");

// Fonction pour récupérer les coordonnées de la ville
async function fetchCoordinates(city) {

    //requete
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&addressdetails=1&limit=1`);
    // On attends la réponse en JSON
    const data = await response.json();
    console.log("Données de coordonnées :", data); // Debug des données
    if (data.length > 0) {
    //   on stock la réponse dans un tableau data
      const { lat, lon } = data[0];
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) }; // on tranforme en nombre la réponse
    } else {
      //  message d'erreur
      COORDINATESDISPLAY.textContent = `Ville "${city}" non trouvée.`;
      return {}; 
    }

}

// Fonction pour récupérer les données météo

async function fetchWeather(latitude, longitude) {
    // requête
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,relative_humidity_2m`);
    const data = await response.json();
    console.log("Données météo :", data); 

    // On vérifie qu'il y a bien quelque chose dans data

    if (data.current) {
        // stocker la température
        const { temperature_2m } = data.current;
        // Retour de la réponse
        return { temperature: temperature_2m.toFixed(1) };
    } else {
        TEMPERATUREDISPLAY.textContent = "Indisponible";
        return {}; 
    }
}

// Fonction pour mettre à jour l'affichage
async function updateWeather(city) {
  // Affichage
  CITYDISPLAY.textContent = "Chargement...";
  COORDINATESDISPLAY.textContent = "";
  TEMPERATUREDISPLAY.textContent = "-°C";
  DETAILSDISPLAY.textContent = "Mise à jour en cours...";


  // On récupère les coordonnées de la ville
  const { latitude, longitude } = await fetchCoordinates(city);
  if (latitude && longitude) {
    // On récupère la température avec les coordonnées
    const { temperature } = await fetchWeather(latitude, longitude);
    console.log("Données météo récupérées :", temperature); // Debug de la température
    // On mets à jour l'affichage 
    CITYDISPLAY.textContent = city;
    COORDINATESDISPLAY.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
    TEMPERATUREDISPLAY.textContent = `${temperature}°C`;
  } else {
    //  message d'erreur
    CITYDISPLAY.textContent = "Erreur";
    COORDINATESDISPLAY.textContent = "";
    TEMPERATUREDISPLAY.textContent = "-°C";
    DETAILSDISPLAY.textContent = "";
  }
}

// Ajout de l'événement click sur le bouton
FETCHBUTTON.addEventListener('click', () => {
  // 1. Récupérer le nom de la ville saisi dans l'input
  const city = CITYINPUT.value;
  // 2. Mettre à jour l'affichage avec les informations météorologiques de la ville
  updateWeather(city);
});