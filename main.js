
const express = require("express");
const mongoose = require("mongoose");
const { SocketAddress } = require("net");
const path = require('path');
const { Dog,AnalyticsLog } = require("./models");

const app = express();


//New imports
const http = require('http').Server(app);
//Pass the Express app into the HTTP module.
const socketIO = require('socket.io')(http);

const base_api_url = '/api/v1'
app.use(express.json());
app.use('/static',express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set('view engine','ejs')

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected`);
    socket.broadcast.emit("response", "hey please receive this");

  socket.on("disconnect", () => {
   
    console.log("A user disconnected");
    socket.broadcast.emit("response", 'hey please receive this');
  });

  socket.on("message", (data) => {
    //sends the data to everyone except you.
    socket.broadcast.emit("response", data);

    //sends the data to everyone connected to the server
    // socket.emit("response", data)
  });
});


app.get(`${base_api_url}/dogs`, async (req, res) => {
  const allDogs = await Dog.find();
  return res.status(200).json(allDogs);
});

app.get(`${base_api_url}/dogs/:id`, async (req, res) => {
  const { id } = req.params;
  const dog = await Dog.findById(id);
  return res.status(200).json(dog);
});

app.post(`${base_api_url}/dogs`, async (req, res) => {
  const newDog = new Dog({ ...req.body });
  const insertedDog = await newDog.save();
  return res.status(201).json(insertedDog);
});

app.put(`${base_api_url}/dogs/:id`, async (req, res) => {
  const { id } = req.params;
  await Dog.updateOne({ id }, req.body);
  const updatedDog = await Dog.findById(id);
  return res.status(200).json(updatedDog);
});

app.delete(`${base_api_url}/dogs/:id`, async (req, res) => {
  const { id } = req.params;
  const deletedDog = await Dog.findByIdAndDelete(id);
  return res.status(200).json(deletedDog);
});


app.get(`${base_api_url}/analytics/logs`, async (req, res) => {
  const allLogs = await AnalyticsLog.find();
  return res.status(200).json(allLogs);
});

app.get(`${base_api_url}/analytics/logs/:id`, async (req, res) => {
  const { id } = req.params;
  const log = await AnalyticsLog.findById(id);
  return res.status(200).json(log);
});

app.post(`${base_api_url}/analytics/logs`, async (req, res) => {
  const newLog = new AnalyticsLog({ ...req.body });
  const insertedLog = await newLog.save();
  socketIO.emit('log_inserted',insertedLog)
  return res.status(201).json(insertedLog);


});

app.put(`${base_api_url}/analytics/logs/:id`, async (req, res) => {
  const { id } = req.params;
  await AnalyticsLog.updateOne({ id }, req.body);
  const updatedLog = await Dog.findById(id);
  return res.status(200).json(updatedLog);
});

app.delete(`${base_api_url}/analytics/logs/:id`, async (req, res) => {
  const { id } = req.params;
  const deletedLog = await AnalyticsLog.findByIdAndDelete(id);
  return res.status(200).json(deletedLog);
});

app.get("/live", (req, res) => {
  res.sendFile(path.join(__dirname, "views/live.html"));
});

app.get("/search", (req, res) => {
  res.sendFile(path.join(__dirname, "views/search.html"));
});

app.get("/logout", (req, res) => {
  res.sendFile(path.join(__dirname, "views/logout.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views/login.html"));
});





const start = async () => {
  try {
    await mongoose.connect(
      "mongodb://mongoadmin:secret@localhost:27017/mongoose?authSource=admin"
    );
    http.listen(3000, () => console.log("Server started on port 3000"));
    console.log(path.join(__dirname, "public"))
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();