const express = require('express');
const axios = require('axios');
const path = require('path')
const bodyParser = require("body-parser")
const app = express();
const PORT = process.env.PORT || 8000;

// Set up middleware to serve static files from the 'public' directory
app.use(express.static('public'));
app.use(bodyParser.json())
app.get('/', async (req, res) => {
   
    const htmlFilePath = path.join(__dirname, 'public', 'index.html');

    res.sendFile(htmlFilePath)

});
app.post('/search', async (req, res) => {
   try {
    console.log(req.body)
    const searchTerm = req.body.searchTerm;

    if (!searchTerm) {
      // Handle the case where no search term is provided
      return res.status(400).send('Bad Request: Please provide a search term');
    }

    const response = await axios.get('https://itunes.apple.com/search', {
      params: {
        term: searchTerm,
        limit : 4
      },
    });
   

    const albums = response.data.results;
    console.log(albums.length)
    res.json(albums)
   } catch (error) {
    res.send(error)
   }

});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
