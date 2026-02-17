const form = document.querySelector("form");

const cidadeInput = document.getElementById("input-city");
const city = document.getElementById("city");
const weather = document.getElementById("weather");

const weatherToday = document.getElementById("weather-today");
const monday = document.getElementById("weather-monday");
const tuesday = document.getElementById("weather-tuesday");
const wednesday = document.getElementById("weather-wednesday");
const thursday = document.getElementById("weather-thursday");
const friday = document.getElementById("weather-friday");


const forecastSection = document.getElementById("forecast-section");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nomeCidade = cidadeInput.value.trim();

    if (!nomeCidade) {
        city.innerText = "Digite uma cidade";
        forecastSection.classList.add("hidden");
        return;
    }

    try {
        // Esconde enquanto carrega
        forecastSection.classList.add("hidden");
        weather.innerText = "Carregando...";

        // 1️⃣ Buscar latitude e longitude
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${nomeCidade}&count=1&language=pt&format=json`;

        const geoResponse = await fetch(geoUrl);

        if (!geoResponse.ok) {
            throw new Error("Erro ao buscar localização");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            city.innerText = "Cidade não encontrada";
            weather.innerText = "";
            return;
        }

        const latitude = geoData.results[0].latitude;
        const longitude = geoData.results[0].longitude;

        city.innerText = geoData.results[0].name;

        // 2️⃣ Buscar previsão diária
        const climaUrl =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max&timezone=auto`;

        const climaResponse = await fetch(climaUrl);

        if (!climaResponse.ok) {
            throw new Error("Erro ao buscar clima");
        }

        const climaData = await climaResponse.json();

        const temperaturas = climaData.daily.temperature_2m_max;

        // 3️⃣ Preencher dados
        weatherToday.innerText = `${temperaturas[0]}°C`;
        monday.innerText = `${temperaturas[1]}°C`;
        tuesday.innerText = `${temperaturas[2]}°C`;
        wednesday.innerText = `${temperaturas[3]}°C`;
        thursday.innerText = `${temperaturas[4]}°C`;
        friday.innerText = `${temperaturas[5]}°C`;

        weather.innerText = "Previsão máxima para os próximos dias";

        // 🔥 MOSTRA A SECTION AGORA
        forecastSection.classList.remove("hidden");

    } catch (error) {
        console.error(error);
        city.innerText = "Erro ao buscar dados";
        weather.innerText = "";
        forecastSection.classList.add("hidden");
    }
});
