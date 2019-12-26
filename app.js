const express = require('express');
const app = express();

app.get('/greetings', (req, res) => {
    res.json({greeting: 'hello World!'});
});

app.listen(3000, () => console.log('Quote API listening on port 3000!'));