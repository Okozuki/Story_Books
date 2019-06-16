const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Connect to mongoose
const uri = "mongodb+srv://okozuki:amFIfVhiIFqp9ULV@cluster0-mjq78.gcp.mongodb.net/storybooks-db?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true
})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));



app.get('/', (req, res) => {
  res.send('It works!!')
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


