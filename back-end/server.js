import cors from 'cors';
import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

app.get('/', async (req, res) => {
    try {
        const { text, source, target } = req.query;

        // Validate query parameters
        if (!text || !source || !target) {
            return res.status(400).send('Missing required query parameters');
        }

        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`;
        const response = await fetch(url);

        // Check if the response is okay
        if (!response.ok) {
            throw new Error('Failed to fetch translation');
        }

        const json = await response.json();

        // Validate the structure of the response
        if (!json.matches || !Array.isArray(json.matches) || json.matches.length === 0) {
            return res.send('No translation found');
        }

        const matches = json.matches;
        const translatedText = matches[matches.length - 1].translation;
        res.send(translatedText);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong!');
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

