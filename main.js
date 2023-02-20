
const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const { Dog } = require("./models");

const app = express();

app.use(express.json());

app.set("views", path.join(__dirname, "views"));
app.set('view engine','ejs')

app.get("/dogs", async (req, res) => {
  const allDogs = await Dog.find();
  return res.status(200).json(allDogs);
});

app.get("/dogs/:id", async (req, res) => {
  const { id } = req.params;
  const dog = await Dog.findById(id);
  return res.status(200).json(dog);
});

app.post("/dogs", async (req, res) => {
  const newDog = new Dog({ ...req.body });
  const insertedDog = await newDog.save();
  return res.status(201).json(insertedDog);
});

app.put("/dogs/:id", async (req, res) => {
  const { id } = req.params;
  await Dog.updateOne({ id }, req.body);
  const updatedDog = await Dog.findById(id);
  return res.status(200).json(updatedDog);
});

app.delete("/dogs/:id", async (req, res) => {
  const { id } = req.params;
  const deletedDog = await Dog.findByIdAndDelete(id);
  return res.status(200).json(deletedDog);
});

app.get("/", (req, res) => {
res.sendfile("views/index.html");
});

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb://mongoadmin:secret@localhost:27017/mongoose?authSource=admin"
    );
    app.listen(3000, () => console.log("Server started on port 3000"));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();