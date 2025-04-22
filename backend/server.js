const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(PORT, () => {
    console.log(`✅ Serverul rulează pe http://localhost:${PORT}`);
});

const sequelize = require('./config/database');

sequelize.authenticate()
    .then(() => console.log('✅ Conectat la baza de date'))
    .catch(err => console.error('❌ Eroare la conectare:', err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
