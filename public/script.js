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

// Webhook DOM elements
const userWebhookSection = document.getElementById('userWebhookSection');
const bothWebhookSection = document.getElementById('bothWebhookSection');
const userWebhookUrl = document.getElementById('userWebhookUrl');
const bothWebhookUrl = document.getElementById('bothWebhookUrl');
const sendUserWebhookBtn = document.getElementById('sendUserWebhookBtn');
const sendBothWebhookBtn = document.getElementById('sendBothWebhookBtn');
const userWebhookStatus = document.getElementById('userWebhookStatus');
const bothWebhookStatus = document.getElementById('bothWebhookStatus');

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

// Webhook utility functions
function showWebhookStatus(statusElement, message, type) {
    statusElement.textContent = message;
    statusElement.className = `webhook-status ${type}`;
    statusElement.classList.remove('hidden');
}

function hideWebhookStatus(statusElement) {
    statusElement.classList.add('hidden');
}

function validateWebhookUrl(url) {
    try {
        new URL(url);
        return url.startsWith('http://') || url.startsWith('https://');
    } catch {
        return false;
    }
}

async function sendWebhook(url, payload, eventType) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/webhook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url, payload, eventType })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message || 'Webhook failed');
        }
        
        return { success: true, status: result.status, response: result.response };
    } catch (err) {
        throw new Error(`Webhook failed: ${err.message}`);
    }
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
        // Show webhook section for user data
        userWebhookSection.classList.remove('hidden');
        bothWebhookSection.classList.add('hidden');
        hideWebhookStatus(userWebhookStatus);
    } catch (err) {
        showError(err.message);
    }
});

getPokemonBtn.addEventListener('click', async () => {
    showLoading();
    try {
        const pokemon = await fetchRandomPokemon();
        showResults({ pokemon });
        // Hide webhook sections for Pokemon only
        userWebhookSection.classList.add('hidden');
        bothWebhookSection.classList.add('hidden');
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
        // Show webhook section for both data
        userWebhookSection.classList.add('hidden');
        bothWebhookSection.classList.remove('hidden');
        hideWebhookStatus(bothWebhookStatus);
    } catch (err) {
        showError(err.message);
    }
});

// Webhook event handlers
sendUserWebhookBtn.addEventListener('click', async () => {
    const url = userWebhookUrl.value.trim();
    
    if (!url) {
        showWebhookStatus(userWebhookStatus, 'Please enter a webhook URL', 'error');
        return;
    }
    
    if (!validateWebhookUrl(url)) {
        showWebhookStatus(userWebhookStatus, 'Please enter a valid URL (http:// or https://)', 'error');
        return;
    }
    
    // Get the current user data from the results
    const currentData = JSON.parse(output.textContent);
    if (!currentData.user) {
        showWebhookStatus(userWebhookStatus, 'No user data available. Please fetch user data first.', 'error');
        return;
    }
    
    sendUserWebhookBtn.disabled = true;
    showWebhookStatus(userWebhookStatus, 'Sending to webhook...', 'loading');
    
    try {
        const result = await sendWebhook(url, currentData, 'random_user');
        showWebhookStatus(userWebhookStatus, `Successfully sent to webhook! Status: ${result.status}`, 'success');
    } catch (err) {
        showWebhookStatus(userWebhookStatus, err.message, 'error');
    } finally {
        sendUserWebhookBtn.disabled = false;
    }
});

sendBothWebhookBtn.addEventListener('click', async () => {
    const url = bothWebhookUrl.value.trim();
    
    if (!url) {
        showWebhookStatus(bothWebhookStatus, 'Please enter a webhook URL', 'error');
        return;
    }
    
    if (!validateWebhookUrl(url)) {
        showWebhookStatus(bothWebhookStatus, 'Please enter a valid URL (http:// or https://)', 'error');
        return;
    }
    
    // Get the current data from the results
    const currentData = JSON.parse(output.textContent);
    if (!currentData.user || !currentData.pokemon) {
        showWebhookStatus(bothWebhookStatus, 'No data available. Please fetch both user and Pokemon data first.', 'error');
        return;
    }
    
    sendBothWebhookBtn.disabled = true;
    showWebhookStatus(bothWebhookStatus, 'Sending to webhook...', 'loading');
    
    try {
        const result = await sendWebhook(url, currentData, 'random_user_pokemon');
        showWebhookStatus(bothWebhookStatus, `Successfully sent to webhook! Status: ${result.status}`, 'success');
    } catch (err) {
        showWebhookStatus(bothWebhookStatus, err.message, 'error');
    } finally {
        sendBothWebhookBtn.disabled = false;
    }
});

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('IGF App loaded successfully!');
    console.log('API Base URL:', API_BASE_URL);
});
