const express = require("express");
const path = require("path");
const cors = require("cors");
const bcrypt = require('bcrypt')
const token = require('jsonwebtoken')
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const authRoutes=require('./Routes/routes');
const passportSetup=require('./passport-setup');
const app = express();
require('dotenv').config()




app.use(cors());




app.use(express.json())





const dbPath = path.join(__dirname, "Products.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`Server Running at http://localhost:${port}`);
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/items", async (request, response) => {
  const {
    sort_by = "id",
    search_q = "",
    order = "ASC",
    category_id = "",
  } = request.query;

  let dbQuery = `SELECT * FROM Items WHERE name LIKE '%${search_q}%' ORDER BY ${sort_by} ${order}`;
  if (category_id !== "") {
    dbQuery = `SELECT * FROM Items WHERE category_id=${category_id} AND name LIKE '%${search_q}%' ORDER BY ${sort_by} ${order}`;
  }
  const data = await db.all(dbQuery);

  response.json(data);
});

app.get("/categories", async (request, response) => {
  const dbQuery = `SELECT * FROM categories;`;
  const data = await db.all(dbQuery);

  response.json(data);
});

  
   
});
