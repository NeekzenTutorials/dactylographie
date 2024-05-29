const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour servir des fichiers statiques
app.use(express.static('public'));

// API pour obtenir un texte aléatoire
app.get('/api/random-text', (req, res) => {
    const textsDir = path.join(__dirname, 'texts');
    fs.readdir(textsDir, (err, files) => {
        if (err) {
            return res.status(500).send('Erreur lors de la lecture des fichiers.');
        }

        const randomFile = files[Math.floor(Math.random() * files.length)];
        fs.readFile(path.join(textsDir, randomFile), 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send('Erreur lors de la lecture du fichier.');
            }
            res.json({ text: data });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
