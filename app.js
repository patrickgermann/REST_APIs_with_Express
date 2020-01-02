const express = require('express');
const app = express();

// import records.js for db methods 
const records = require('./records');

// Helper function to remove try catch blocks in routes
function asyncHandler(cb){
    return async (req, res, next)=>{
      try {
        await cb (req, res, next);
      } catch(err){
        next(err);
      }
    };
  }

app.use(express.json());

// Send a GET request to /quotes to READ a list of quotes
app.get('/quotes', asyncHandler( async (req, res) => {
        const quotes = await records.getQuotes();
        res.json(quotes);
}));

// Send a GET request to /quotes/:id to READ (view) a quote
app.get('/quotes/:id', asyncHandler( async (req, res) => {
        const quote = await records.getQuote(req.params.id);
        if (quote) {
            res.json(quote);
        } else {
            res.status(404).json({message: "Quote not found!"});
        }
}));

// Send a POST request to /quotes to CREATE a new quote
app.post('/quotes', asyncHandler( async (req, res) => {
    if (req.body.author && req.body.quote) {
        const quote = await records.createQuote({
            quote: req.body.quote,
            author: req.body.author
        });
        res.status(201).json(quote);      
    } else {
        res.status(400).json({message: "Quote and author required."});
    }
}));


// Send a PUT request to /quotes/:id to UPDATE (edit) a quote
app.put('/quotes/:id', asyncHandler( async (req,res) => {
    const quote = await records.getQuote(req.params.id);
        if (quote) {
            quote.quote = req.body.quote;
            quote.author = req.body.author;
 
            await records.updateQuote(quote);
            res.status(204).end();

        } else {
            res.status(404).json({message: "Quote not found!"});
        }
}));

// Send a DELETE request to /quotes/:id to DELETE a quote
app.delete('/quotes/:id', asyncHandler( async (req,res, next) => {
    const quote = await records.getQuote(req.params.id);
    if (quote){
        await records.deleteQuote(quote);
        res.status(204).end();
    } else {
        res.status(404).json({message: "Quote not found!"});
    }
}));

// Send a GET request to /quotes/quote/random to READ (view) a random quote

// Middleware, when no route has been found
app.use( (req, res, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
});

// Error handler (used by Middleware)
app.use( (err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

app.listen(3000, () => console.log('Quote API listening on port 3000!'));