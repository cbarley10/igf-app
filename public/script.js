// Get the API base URL - use the deployed Railway URL or localhost for development
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : 'https://igf-app-production.up.railway.app';

// DOM elements
const getUserBtn = document.getElementById('getUserBtn');
const getPokemonBtn = document.getElementById('getPokemonBtn');
const getBothBtn = document.getElementById('getBothBtn');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const output = document.getElementById('output');
const error = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');

// Utility functions
function showLoading() {
    hideAll();
    loading.classList.remove('hidden');
}

function showResults(data) {
    hideAll();
    output.textContent = JSON.stringify(data, null, 2);
    results.classList.remove('hidden');
}

function showError(message) {
    hideAll();
    errorMessage.textContent = message;
    error.classList.remove('hidden');
}

function hideAll() {
    loading.classList.add('hidden');
    results.classList.add('hidden');
    error.classList.add('hidden');
}

// API functions
async function fetchRandomUser() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/random`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.user;
    } catch (err) {
        console.error('Error fetching user:', err);
        throw new Error(`Failed to fetch user: ${err.message}`);
    }
}

async function fetchRandomPokemon() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/pokemon/random`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.pokemon;
    } catch (err) {
        console.error('Error fetching Pokemon:', err);
        throw new Error(`Failed to fetch Pokemon: ${err.message}`);
    }
}

// Event handlers
getUserBtn.addEventListener('click', async () => {
    showLoading();
    try {
        const user = await fetchRandomUser();
        showResults({ user });
    } catch (err) {
        showError(err.message);
    }
});

getPokemonBtn.addEventListener('click', async () => {
    showLoading();
    try {
        const pokemon = await fetchRandomPokemon();
        showResults({ pokemon });
    } catch (err) {
        showError(err.message);
    }
});

getBothBtn.addEventListener('click', async () => {
    showLoading();
    try {
        // Fetch both in parallel for better performance
        const [user, pokemon] = await Promise.all([
            fetchRandomUser(),
            fetchRandomPokemon()
        ]);
        showResults({ user, pokemon });
    } catch (err) {
        showError(err.message);
    }
});

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('IGF App loaded successfully!');
    console.log('API Base URL:', API_BASE_URL);
});
