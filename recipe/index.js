const express = require('express');
const { db } = require('./auth.middleware')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let initialRecipe = [
  {
    name: 'Spaghetti Carbonara',
    description: 'A classic Italian pasta dish.',
    preparationTime: '15 minutes',
    cookingTime: 15,
    imageUrl: 'https://hips.hearstapps.com/hmg-prod/images/carbonara-index-6476367f40c39.jpg?crop=0.888888888888889xw:1xh;center,top&resize=1200:*',
    country: 'Italy',
    veg: true,
    id: 1
  }
];
// GET Route for the base URL
app.get("/", (req, res) => {
  res.send("welcome to the recipe api")
})

// GET Route to fetch all recipes
app.get("/recipe/all", (req, res) => {
  res.send(initialRecipe);
})

// Serve index.html
app.get('/index', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Serve recipe.html
app.get('/add', (req, res) => {
  res.sendFile(__dirname + '/recipe.html');
});

// POST Route to add a new recipe
app.post('/recipe/add',db, (req, res) => {
  const newRecipe = {
    name: req.body.name,
    description: req.body.description,
    preparationTime: req.body.preparationTime,
    cookingTime: req.body.cookingTime,
    imageUrl: req.body.imageUrl,
    country: req.body.country,
    veg: req.body.veg,
    id: initialRecipe.length + 1
  };
  initialRecipe.push(newRecipe);
  res.json(initialRecipe);
});

// patch Route

app.patch('/recipe/update/:id', (req, res) => {
  const { id } = req.params;
  const updatedRecipe = req.body;
  const updatedRecipes = initialRecipe.map(recipe => {
    if (recipe.id === parseInt(id)) {
      return { ...recipe, ...updatedRecipe };
    }
    return recipe;
  });
  initialRecipe = updatedRecipes;
  res.json(initialRecipe);
});

// DELETE Route to delete a recipe by ID
app.delete('/recipe/delete/:id', (req, res) => {
  const { id } = req.params;
  initialRecipe = initialRecipe.filter(recipe => recipe.id != id);
  res.json(initialRecipe);
});

// Query Params Filter

app.get('/recipe/filter', (req, res) => {
  let { veg , cookingTime ,country} = req.query

  if (cookingTime == 'lth') {
    let lth = initialRecipe.sort((a, b) => a.cookingTime - b.cookingTime)
    res.send(lth)
  }
  else if (cookingTime == 'htl') {
    let htl = initialRecipe.sort((a, b) => b.cookingTime - a.cookingTime)
    res.send(htl)
  }

  let countryfil = initialRecipe.filter(ele => ele.country == country)
  let food = initialRecipe.filter((ele) => ele.veg.toString() == veg)
  res.send(countryfil)
  res.send(food)
})

app.listen(8090, () => {
  console.log('server running on :8090 port');
})