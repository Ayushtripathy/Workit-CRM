const PORT = 8000;
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const url = process.env.ASTRA_URl;
const token = process.env.ASTRA_TOKEN;

//Get req to now display the posted tasks from direct db
app.get("/tickets", async (req, res) => {
  const options = {
    method: "GET",
    headers: {
      Accepts: "application/json",
      "X-Cassandra-Token": token,
    },
  };
  try {
    const response = await axios(`${url}?page-size=20`, options);
    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

//Post req to submit the data from the form to db
app.post("/tickets", async (req, res) => {
  //Get the form data from frontend
  const formData = req.body.formData;

  const options = {
    method: "POST",
    headers: {
      Accepts: "application/json",
      "X-Cassandra-Token": token,
      "Content-Type": "application/json",
    },
    data: formData,
  };

  try {
    //Post the task onto astra db collection
    const response = await axios(url, options);
    res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});

//Get a single task
app.get("/tickets/:documentId", async (req, res) => {
  const id = req.params.documentId;

  const options = {
    method: "GET",
    headers: {
      Accepts: "application/json",
      "X-Cassandra-Token": token,
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios(`${url}/${id}`, options);
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

//Put req to edit the task in db
app.put("/tickets/:documentId", async (req, res) => {
  const id = req.params.documentId;
  const data = req.body.data;

  const options = {
    method: "PUT",
    headers: {
      Accepts: "application/json",
      "X-Cassandra-Token": token,
    },
    data,
  };

  try {
    const response = await axios(`${url}/${id}`, options);
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

//Delete req to delete the task from db
app.delete("/tickets/:documentId", async (req, res) => {
  const id = req.params.documentId;

  const options = {
    method: "DELETE",
    headers: {
      Accepts: "application/json",
      "X-Cassandra-Token": token,
    },
  };

  try {
    const response = await axios(`${url}/${id}`, options);
    res.status(200).json(response.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

app.listen(PORT, () => console.log("server running on port " + PORT));
