const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static('public'));

// Sample data for fake users
const sampleUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', age: 28, city: 'New York' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', age: 34, city: 'Los Angeles' },
  { id: 3, name: 'Carol Davis', email: 'carol@example.com', age: 25, city: 'Chicago' },
  { id: 4, name: 'David Wilson', email: 'david@example.com', age: 42, city: 'Houston' },
  { id: 5, name: 'Eva Brown', email: 'eva@example.com', age: 31, city: 'Phoenix' },
  { id: 6, name: 'Frank Miller', email: 'frank@example.com', age: 29, city: 'Philadelphia' },
  { id: 7, name: 'Grace Lee', email: 'grace@example.com', age: 26, city: 'San Antonio' },
  { id: 8, name: 'Henry Taylor', email: 'henry@example.com', age: 38, city: 'San Diego' },
  { id: 9, name: 'Ivy Anderson', email: 'ivy@example.com', age: 33, city: 'Dallas' },
  { id: 10, name: 'Jack Thomas', email: 'jack@example.com', age: 27, city: 'San Jose' }
];

// Sample Pokemon data
const pokemonList = [
  { id: 1, name: 'Pikachu', type: 'Electric', level: 25, hp: 100 },
  { id: 2, name: 'Charizard', type: 'Fire/Flying', level: 50, hp: 200 },
  { id: 3, name: 'Blastoise', type: 'Water', level: 45, hp: 180 },
  { id: 4, name: 'Venusaur', type: 'Grass/Poison', level: 48, hp: 190 },
  { id: 5, name: 'Mewtwo', type: 'Psychic', level: 70, hp: 300 },
  { id: 6, name: 'Dragonite', type: 'Dragon/Flying', level: 55, hp: 250 },
  { id: 7, name: 'Snorlax', type: 'Normal', level: 40, hp: 220 },
  { id: 8, name: 'Gyarados', type: 'Water/Flying', level: 42, hp: 210 },
  { id: 9, name: 'Alakazam', type: 'Psychic', level: 35, hp: 120 },
  { id: 10, name: 'Machamp', type: 'Fighting', level: 38, hp: 160 }
];

// Helper function to get random item from array
const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Helper function to generate random user data
const generateRandomUser = () => {
  const names = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn', 'Sage', 'River'];
  const surnames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
  
  const name = `${getRandomItem(names)} ${getRandomItem(surnames)}`;
  const email = `${name.toLowerCase().replace(' ', '.')}@example.com`;
  const age = Math.floor(Math.random() * 50) + 18; // Age between 18-67
  const city = getRandomItem(cities);
  
  return {
    id: Math.floor(Math.random() * 10000) + 1,
    name,
    email,
    age,
    city
  };
};

// Routes
app.get('/', (req, res) => {
  console.log('Home');
  res.send('Hello from IGF App');
});

// 1. Authentication endpoint
app.post('/api/auth', (req, res) => {
  console.log('Authentication');
  const { username, password } = req.body;
  
  // Simple mock authentication - accepts any username/password
  if (username && password) {
    res.json({
      success: true,
      message: 'Authentication successful',
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        username,
        id: Math.floor(Math.random() * 1000) + 1
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Username and password are required'
    });
  }
});

// 2. Random user data endpoint
app.get('/api/users/random', (req, res) => {
  console.log('Random users');
  const user = generateRandomUser();
  
  if(!user) {
    return res.status(404).json({
      success: false,
      message: 'No user found',
      count: 0,
      user: null
    });
  }
  return res.status(200).json({
    success: true,
    message: 'User found',
    count: 1,
    user
  });
});

// 3. Random Pokemon endpoint
app.get('/api/pokemon/random', (req, res) => {
  console.log('Random Pokemon');
  const pokemon = getRandomItem(pokemonList);
  
  if(!pokemon) {
    return res.status(404).json({
      success: false,
      message: 'No Pokemon found',
      count: 0,
      pokemon: null
    });
  }
  return res.status(200).json({
    success: true,
    message: 'Pokemon found',
    count: 1,
    pokemon
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check');
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Home: http://localhost:${PORT}/`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Authentication: POST http://localhost:${PORT}/api/auth`);
  console.log(`Random users: GET http://localhost:${PORT}/api/users/random`);
  console.log(`Random Pokemon: GET http://localhost:${PORT}/api/pokemon/random`);
});

module.exports = app;
