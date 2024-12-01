const express = require('express');
const session = require('express-session');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configura la sesión
app.use(session({
    secret: 'JYoWBI7DJ9qLf8EEeLsXhvs07CA5HCqS',
    resave: false,
    saveUninitialized: false
}));

// URL de redireccionamiento codificada
const redirectURI = encodeURIComponent('https://eee.github.io/callback');

app.get('/login', (req, res) => {
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${redirectURI}&response_type=code&scope=identify%20guilds`);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) return res.sendStatus(400);

    const body = new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'https://eee.github.io/callback'  // Actualiza aquí también
    });

    try {
        const response = await axios.post('https://discord.com/api/oauth2/token', body);
        const { access_token } = response.data;

        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        const guildsResponse = await axios.get('https://discord.com/api/users/@me/guilds', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        req.session.user = userResponse.data;
        req.session.guilds = guildsResponse.data;

        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.get('/dashboard', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.send(`
        <h1>Bienvenido ${req.session.user.username}</h1>
        <p>Estás en los siguientes servidores:</p>
        <ul>
            ${req.session.guilds.map(guild => `<li>${guild.name}</li>`).join('')}
        </ul>
    `);
});

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
