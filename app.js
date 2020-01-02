const express = require('express');
const app = express();
const routes = require('./routes');

app.use(express.json());

//if route begins with /api, use the routes.js
app.use('/api', routes);

// Middleware, when no route has been found
app.use( (req, res, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
});

// Middleware Error handler
app.use( (err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

app.listen(3000, () => console.log('Quote API listening on port 3000!'));