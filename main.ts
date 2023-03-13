import { users } from './users';
import express,{ Application } from "express";
let dotenv = require('dotenv').config()
import mongoose from "mongoose";

import swaggerUi from "swagger-ui-express";

import path from 'path';
import { AnalyticsLog } from "./models";
import morgan from 'morgan';
import router from './src/routes';

const app :Application= express();



const http = require('http').Server(app);

const socketIO = require('socket.io')(http);

const base_api_url = '/api/v1';
app.use(express.json());
app.use(morgan("tiny"));
app.use('/static',express.static(path.join(__dirname, "public")));

app.use(router);

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);
app.set("views", path.join(__dirname, "views"));
app.set('view engine','ejs')

socketIO.on("connection", (socket: any) => {
  console.log(`⚡: ${socket.id} user just connected`);
    socket.broadcast.emit("response", "hey please receive this");

  socket.on("disconnect", () => {
   
    console.log("A user disconnected");
    socket.broadcast.emit("response", 'hey please receive this');
  });

  socket.on("message", () => 
  {
     socket.broadcast.emit("response",'hey please receive this');
  });
});





app.post(`${base_api_url}/login`, (req: any , res:any) =>  {
    const { username, password } = req.body;

    // Find user by username
    const user = users.find(u => u.username === username);

    if (!user) {
        // User not found
        res.status(401).json({ error: 'Invalid username or password' });
        return;
    }

    // Check password
    if (user.password !== password) {
        // Incorrect password
        res.status(401).json({ error: 'Invalid username or password' });
        return;
    }

    // Login successful
    res.json({ message: 'Login successful', user });
});



app.get(`${base_api_url}/analytics/logs/:id`, async (req: any, res: any) => {
  const { id } = req.params;
  const log = await AnalyticsLog.findById(id);
  return res.status(200).json(log);
});

app.get('/', (req: any, res: { redirect: (arg0: string) => void; }) => {
    res.redirect('/login');
});

app.get(`${base_api_url}/analytics/logs`, async (req: any, res: any) => {


  const {analytics, cameraname , from_date , to_date } = req.query

  const query:any = {};

    if (analytics) query.analytics = analytics;
    if (cameraname) query.CameraName = cameraname;
    if (from_date && to_date) query.timestamp ={
        $gte:from_date,
        $lte:to_date
      }
    
    console.log(query)

    const log = await AnalyticsLog.find(query);

  return res.status(200).json(log);
})

app.post(`${base_api_url}/analytics/logs`, async (req: any, res: any) => {
  const newLog = new AnalyticsLog({ ...req.body });
  const insertedLog = await newLog.save();
  socketIO.emit('log_inserted',insertedLog)
  return res.status(201).json(insertedLog);
});

app.put(`${base_api_url}/analytics/logs/:id`, async (req: any, res: any) => {
  const { id } = req.params;
  await AnalyticsLog.updateOne({ id }, req.body);
  const updatedLog = await AnalyticsLog.findById(id);
  return res.status(200).json(updatedLog);
});

app.delete(`${base_api_url}/analytics/logs/:id`, async (req:any, res: any) => {
  const { id } = req.params;
  const deletedLog = await AnalyticsLog.findByIdAndDelete(id);
  return res.status(200).json(deletedLog);
});

app.get("/live", (req: any, res:any) => {
  // res.sendFile(path.join(__dirname, "views/live.ejs"));
  return res.render('live');
});

app.get("/search", (req: any, res:any) => {
  //  return res.sendFile(path.join(__dirname, "search"));
   return res.render('search');
});

app.get("/logout", (req: any, res: any) => {
    // return res.sendFile(path.join(__dirname, "logout"));
    return res.render('logout');
});

app.get("/aboutus",  (req: any, res: any) => {
    // return res.sendFile(path.join(__dirname, "logout"));
     
    return res.render('about');
});


app.get("/login", (req: any, res:any) => {
  // return res.sendFile(path.join(__dirname, "login"));
  return res.render('login');
});
app.get("/search/detail/:id", async (req: any, res:any) => {
  // return res.sendFile(path.join(__dirname, "login"));
try {
   const { id } = req.params;
  const data = await AnalyticsLog.findById(id)

  return res.render('detail',{data});
} catch (error) {

  return res.render('detail',{error , message:"Cant Find the detail for requested log! "});
    
}
  
 

});


const port =  process.env.APP_PORT
const mongoUri:any =  process.env.MONGO_CONNECTION_STRING
const start = async () => {
  try {
    mongoose.connect(
     mongoUri
    );
    http.listen(port, () => console.log(`Server started on port ${process.env.APP_PORT}`));
    console.log(path.join(__dirname, "public"));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
