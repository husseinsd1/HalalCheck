const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect(process.env.MONGOADDRESS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ingredientSchema = {
  name: String,
  ruling: String,
};

const requestSchema = {
  name: String,
  ruling: String,
  source: String,
};

const Ingredient = mongoose.model("Ingredient", ingredientSchema);
const Request = mongoose.model("Request", requestSchema);

app
  .route("/ingredients")

  .get((req, res) => {
    Ingredient.find((err, foundIngredients) => {
      if (err) {
        res.send(err);
      } else {
        res.send(foundIngredients);
      }
    });
  })

  .post((req, res) => {
    const requestedIngredient = new Request({
      name: req.body.name,
      ruling: req.body.ruling,
      source: req.body.source,
    });

    requestedIngredient.save((err) => {
      if (!err) {
        
      } else {
        res.send(err);
      }
    });
  });

app.route("/ingredients/:name").get((req, res) => {
  Ingredient.findOne({ name: req.params.name }, (err, foundIngredients) => {
    if (foundIngredients) {
      res.send(foundIngredients.ruling);
    } else {
      res.send("No match");
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/request', (req, res) => {
  res.sendFile(__dirname + '/public/request.html');
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
