const express = require("express");
const session = require('express-session');
const app = express();
app.set("view engine", "ejs");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
// const http = require("http");
const https = require("https");
const bcrypt = require("bcrypt");

app.use(session({
  secret: 'ssshhhhh',
  saveUninitialized: true,
  resave: true
}));

app.use(express.json());

pokeapiUrl = "http://localhost:3000/";

mongoose.connect(
  "mongodb+srv://bwroo:123@cluster0.spsh4.mongodb.net/2537?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

//-----SCHEMAS----//

const pokemonSchema = new mongoose.Schema({
  id: Number,
  name: String,
  abilities: [Object],
  stats: [Object],
  sprites: Object,
  types: [Object],
  weight: Number,
}, {
  collection: "pokemon",
});

const abilitySchema = new mongoose.Schema({
  name: String,
  id: Number,
  pokemon: [Object],
}, {
  collection: "ability",
});

const timelinesSchema = new mongoose.Schema({
  text: String,
  hits: Number,
  time: String,
});

const userSchema = new mongoose.Schema({
  user: String,
  password: String,
  cart: [],
  admin: Boolean
}, );

const itemsInCartSchema = new mongoose.Schema({
  pokemon: String,
  quantity: Number,
  user: String,
}, { 
  collection: "itemsincart"
});

const cartSchema = new mongoose.Schema({
  cartitem: [{
    _id: String,
    pokemon: String,
    quantity: Number,
  }],
  username: String,
}, {
  collection: "cart"
});

const cartModel = mongoose.model('cart', cartSchema);
const itemsInCartModel = mongoose.model('itemsincart', itemsInCartSchema);
const userModel = mongoose.model('users', userSchema); //Remember to make Schema on Mongo Compass / Atlas [If this is here. That means I have not done it yet.]
const pokemonModel = mongoose.model('pokemon', pokemonSchema);
const typeModel = mongoose.model('ability', abilitySchema);
const timelinesModel = mongoose.model('timelines', timelinesSchema);


app.use(express.static("public"));
app.use(express.static("game"));

app.use(bodyparser.urlencoded({
  parameterLimit: 100000,
  limit: '50mb',
  extended: true
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/public/main.html`);
})

// password entry

// app.get("/", (req, res) => {
//   res.render("login", {
//     username: "",
//     password: "",
//   })
// })

// app.get("/pokemon/:name", (req, res) => {
//   let queryObject = isNaN(req.params.name) ? {
//     name: req.params.name
//   } : {
//     id: req.params.name
//   };
//   pokemonModel.find(queryObject,
//     (err, body) => {
//       if (err) throw err;
//       res.send(body);
//     }
//   );
// });

function authenticateUser(req, res, next) {
  req.session.authenticated ? next() : res.redirect("/login");
}

app.get("/profile/:id", (req, res) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`;
  pokemon = ""

  https.get(url, function (https_res) {
    https_res.on("data", function (chunk) {
      pokemon += chunk
    })
    https_res.on("end", function () {
      // pokemon += chunk
      pokemon = JSON.parse(pokemon)

      tmp = pokemon.stats.filter((obj) => {
        return obj.stat.name == "hp"
      }).map(
        (obj_2) => {
          return obj_2.base_stat
        }
      )

      atk = pokemon.stats.filter((obj) => {
        return obj.stat.name == "attack"
      }).map(
        (obj_2) => {
          return obj_2.base_stat
        }
      )

      dfsn = pokemon.stats.filter((obj) => {
        return obj.stat.name == "defense"
      }).map(
        (obj_2) => {
          return obj_2.base_stat
        }
      )

      spclatk = pokemon.stats.filter((obj) => {
        return obj.stat.name == "special-attack"
      }).map(
        (obj_2) => {
          return obj_2.base_stat
        }
      )
      spcldfsn = pokemon.stats.filter((obj) => {
        return obj.stat.name == "special-defense"
      }).map(
        (obj_2) => {
          return obj_2.base_stat
        }
      )
      speed = pokemon.stats.filter((obj) => {
        return obj.stat.name == "speed"
      }).map(
        (obj_2) => {
          return obj_2.base_stat
        }
      )
      res.render("profile.ejs", {
        "id": req.params.id,
        "name": pokemon.name,
        "hp": tmp[0],
        "attack": atk[0],
        "defense": dfsn[0],
        "specialatk": spclatk[0],
        "defenseatk": spcldfsn[0],
        "speed": speed[0]
      });
    })
  })
});


app.get("/ability/:name", (req, res) => { //This will give you the type of pokemon
  typeModel.find({
    name: req.params.name,
  }, (err, body) => {
    if (err) throw err;
    res.send(body);
  });
});

// This is where the timeline js begins

app.get("/timeline/getAllEvents", function (req, res) {
  timelinesModel.find({}, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + data);
    }
    res.send(data);
  });
})

app.post('/timeline/insert', function (req, res) {
  timelinesModel.create({
    'text': req.body.text,
    'time': req.body.time,
    'hits': req.body.hits
  }, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + data);
    }
    res.send("Insertion is successful!");
  });
})

app.get("/timeline/delete/:id", function (req, res) {
  // console.log(req.body)
  timelinesModel.remove({
    '_id': req.params.id
  }, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + data);
    }
    res.send("Delete request is successful!");
  });
})

app.get("/timeline/inscreaseHits/:id", function (req, res) {
  // console.log(req.body)
  timelinesModel.updateOne({
    _id: req.params.id,
  }, {
    $inc: {
      hits: 1
    }
  }, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + data);
    }
    res.send("Update request is successful!");
  });
})

app.get("/timeline", function (req, res) {
  timelinesModel.find({}, function (err, timelineLogs) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Data " + JSON.stringify(timelineLogs));
    }
    res.send(JSON.stringify(timelineLogs));
  });
})

app.put("/timeline/delete/:id", function (req, res) {
  timelinesModel.deleteOne({
    _id: req.params.id
  }, function (err, data) {
    if (err) console.log(err);
    else
      console.log(data);
    res.send("All good! Deleted.")
  });
})

app.get("/timeline/update/:id", function (req, res) {
  timelinesModel.updateOne({
    id: req.params.id
  }, {
    $inc: {
      hits: 1
    }
  }, function (err, data) {
    if (err) console.log(err);
    else
      console.log(data);
    res.send("All good! Updated.")
  });
})

app.get("/timeline/removeAll", function (req, res) {
  timelinesModel.deleteMany({
    hits: {
      $gt: 0
    },
  }, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Everything Deleted");
    }
    res.send("Everything has been deleted!");
  })
});

//------RENDERING MY EJS pages ----//

app.post("/authentication", (req, res) => {
  const {
    username,
    password
  } = req.body;
  res.send(req.body);
})

app.get("/userAccount", (req, res) => {
  res.render("userAccount", {
    "username": req.session.username,
  })
})

app.get("/shoppingcart", (req, res) => {

  if (req.session.authenticated) {
    res.render("shoppingcart") 
  } else {
    return res.send("Log in before trying to access your cart!");
  }
})

//show login form
app.get("/login", (req, res) => {
  res.render("login");
})


app.post("/login", (req, res) => {
  userModel.findOne({
    user: req.body.username,
  }, (err, data) => {
    if (err) {
      throw err;
    }
    console.log(`login data ${data}`);
    if (data) {
      const result = bcrypt.compareSync(req.body.password, data.password); //unhasing the password
      if (result) {
        req.session.authenticated = true;
        req.session.username = req.body.username;
        req.session.cart = [];
        console.log(`req username ${req.body.username}`);
        console.log(`session name ${req.session.username}`);
        res.redirect("./userAccount")
      } 
    }else {
      res.render("./login");
    }
  })
})


app.get("/register", (req, res) => {
  res.render("register");
})

// function userExists(user, callback) {
//   userModel.find({
//     user: user
//   }, (err, data) => {
//     if (err) {
//       console.log(err)
//     }
//     return callback(data.length != 0);
//   })
// }

app.get("/profile", (req, res) => {
  res.render("logged in");
})

app.post("/register", (req, res) => {
  // console.log(req.body);
  // console.log(req.body.user);
 
  userModel.findOne({
    user: req.body.user
  }, (error, data) => {
    if (error) {
      throw error;
    }
    console.log(`found user ${data}`);
    if (data) {
      //res.redirect("/register");
      return res.send("Username already taken. Try a different user");
    } else {
      //const salt = await bcrypt.genSalt(10); //Hashing the password
      //const password = await bcrypt.hash(req.body.password, salt);
      const salt = bcrypt.genSaltSync(10);
      let password = bcrypt.hashSync(req.body.password, salt);
      userModel.create({
       user: req.body.user,
        password: password,
      }, (error, data) => {
        if (error) {
          throw error;
        }
        req.session.authenticated = true;
        req.session.username = data.user;
        return res.send("Registration Success");
        //res.redirect("/profile");
      })
    }
  })
})

app.get('/loggedin', (req, res) => {
  if (req.session.authenticated) {
    res.redirect("/userAccount")
  } else {
    res.redirect("/login.ejs")
  }
})

app.get("/logout", (req, res) => {
  req.session.authenticated = false;
  res.send("You have logged out");
})

//-----------CART FUNCTIONALITY --------//

app.get("/cart/insert/:id", (req, res) => {
  console.log('i am here');
  if (req.session.authenticated) {
    data = {"id": req.params.id, "cost": 1, "count": 1};
    var cart = req.session.cart;
    cart.push(data);
    req.session.cart = cart;
    console.log(req.session.cart);
    /*
    userModel.updateOne({
        user: req.session.user
      }, {
        $push: {
          "cart": {
            id: req.params.id,
            cost: 1,
            count: 1
          }
        }
      },
      function (error, data) {
        if (error) {
          console.log("Error " + error);
        } else {
          console.log("Data " + data);
        }
        res.send("Successfully inserted into the cart!");
      });*/
  } else {
    res.send(null);
  }
});

//~~~~~~~~~~~~ADMIN FUNCTIONALITY ~~~~~~~~~~~//
app.get("/getUsers", async (req, res) => {
  const userList = await userModel.find({})
  res.send(userList);
});

app.get("/game/game.html", async (req, res) => {
  res.redirect("/game.html")
})

app.get('/dashboard', async (req, res) => {
  res.render("dashboard");
})