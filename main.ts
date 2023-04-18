import { users } from './users';
import express, { Application } from "express";
import dotenv from "dotenv";

dotenv.config();
import mongoose from "mongoose";

import path from 'path';
import { AnalyticsLog, Challan } from "./models";
import morgan from 'morgan';
import router from './src/routes';
import multer from 'multer';


const app: Application = express();


const BASE_UPLOAD_PATH = "uploads/"

const http = require('http').Server(app);

const socketIO = require('socket.io')(http);

const base_api_url = '/api/v1';


app.use(express.json());


app.use(morgan("tiny"));
//app.use('/static',express.static(path.join(__dirname, "public")));
app.use(express.static('public'));

app.set('views', path.join(__dirname, 'views'));
// app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs')
app.engine('ejs', require('ejs').renderFile);

app.use(router);

const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination folder for uploaded files
    cb(null, `./public/${BASE_UPLOAD_PATH}`);
  },
  filename: function (req, file, cb) {
    const newImageName = file.originalname.replace(/\s+/g, '')
    console.log("new ", newImageName)

    // Set the file name as the current date and time, plus the original file extension
    cb(null, Date.now() + '-' + newImageName);
  }
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination folder for uploaded files
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    const newImageName = file.originalname.replace(/\s+/g, '')
    console.log("new ", file.originalname)

    // Set the file name as the current date and time, plus the original file extension
    cb(null, newImageName);
  }
});
// Set up multer middleware with the storage engine and set the maximum file size to 10 MB
const upload1 = multer({
  storage: storage,
  limits: { fileSize: 10000000 }
}).fields([
  { name: 'ImageURL', maxCount: 10 },
  { name: 'SnapshotURL', maxCount: 5 },
  { name: 'LPImageURL', maxCount: 3 },
  { name: 'RLVDImageURL', maxCount: 3 },
  { name: 'VideoURL', maxCount: 3 }
]);


// app.use(
//   '/api-docs',
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerDocument)
// );

// app.use(
//   "/",
//   swaggerUi.serve,
//   swaggerUi.setup(undefined, {
//     swaggerOptions: {
//       url: "/swagger.json",
//     },
//   })
// );




socketIO.on("connection", (socket: any) => {
  console.log(`⚡: ${socket.id} user just connected`);
  socket.broadcast.emit("response", "hey please receive this");

  socket.on("disconnect", () => {

    console.log("A user disconnected");
    socket.broadcast.emit("response", 'hey please receive this');
  });

  socket.on("message", () => {
    socket.broadcast.emit("response", 'hey please receive this');
  });
});





app.post(`${base_api_url}/login`, (req: any, res: any) => {
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
  const ipPort = req.get('host');
  const protocol = req.protocol

  const log = await AnalyticsLog.findById(id);
  console.log("log", log)
  if (log) {
    log['RLVDImagePath'] = `${protocol}://${ipPort}/${log.RLVDImagePath}`;
    log['VideoPath'] = `${protocol}://${ipPort}/${log.VideoPath}`;
    log['LPImagePath'] = `${protocol}://${ipPort}/${log.LPImagePath}`;
    log['Snapshotpath'] = `${protocol}://${ipPort}/${log.Snapshotpath}`;

  }
  return res.status(200).json(log);
});


app.get(`/challan/fetch/:id`, async (req: any, res: any) => {
  const { id } = req.params;
  const log = await Challan.findById(id);
  console.log("log", log)
  return res.status(200).json(log);
});


app.get('/', (req: any, res: { redirect: (arg0: string) => void; }) => {
  res.redirect('/login');
});

app.get(`${base_api_url}/analytics/logs`, async (req: any, res: any) => {

  // console.log(req.get('host'))
  const ipPort = req.get('host');
  const protocol = req.protocol
  // console.log(req.hostname, req.port, req.protocol)

  const { EventType, cameraname, from_date, to_date } = req.query

  const query: any = {};

  if (EventType) query.EventType = {

    $in: EventType.split(',')
  };
  if (cameraname) query.CameraName = cameraname;
  if (from_date && to_date) query.timestamp = {
    $gte: from_date,
    $lte: to_date
  }


  const log = await AnalyticsLog.find(query).sort({ "timestamp": -1 });;

  log.forEach(logObj => {

    logObj['RLVDImagePath'] = `${protocol}://${ipPort}/${logObj.RLVDImagePath}`;
    logObj['VideoPath'] = `${protocol}://${ipPort}/${logObj.VideoPath}`;
    logObj['LPImagePath'] = `${protocol}://${ipPort}/${logObj.LPImagePath}`;
    logObj['Snapshotpath'] = `${protocol}://${ipPort}/${logObj.Snapshotpath}`;


    //console.log("element", logObj.RLVDImageURL)

  });

  return res.status(200).json(log);

});





// Set up multer middleware with the storage engine and set the maximum file size to 10 MB
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }
}).fields([
  { name: 'ImageURL', maxCount: 10 },
  { name: 'SnapshotURL', maxCount: 5 },
  { name: 'LPImageURL', maxCount: 3 },
  { name: 'RLVDImageURL', maxCount: 3 },
  { name: 'VideoURL', maxCount: 3 }
]);

app.post(`${base_api_url}/analytics/logs`, upload, async (req: any, res: any) => {

  let images: any
  let SnapshotURL: any
  let videos: any
  let RLVDImageURL: any
  let VideoURL: any
  const ipPort = req.get('host');
  const protocol = req.protocol
  try {
    images = req.files['ImageURL'];
    SnapshotURL = req.files['SnapshotURL'];
    videos = req.files['LPImageURL'];
    RLVDImageURL = req.files['RLVDImageURL'];
    VideoURL = req.files['VideoURL'];


  }

  catch {
    console.log("error")
  }

  let imageName;
  let SnapshotName;
  let LPImageName;
  let RLVDImageName;
  let VideoName;

  if (images) {
    images.forEach((element: any) => {
      console.log("name  ", element.filename)

      imageName = BASE_UPLOAD_PATH + element.filename

    });
  }

  if (SnapshotURL) {
    SnapshotURL.forEach((element: any) => {
      // console.log("name ", element.filename)

      SnapshotName = BASE_UPLOAD_PATH + element.filename

    });
  }

  if (videos) {
    videos.forEach((element: any) => {
      // console.log("name  ", element.filename)

      LPImageName = BASE_UPLOAD_PATH + element.filename

    });
  }
  if (RLVDImageURL) {
    RLVDImageURL.forEach((element: any) => {
      console.log("name  ", element.filename)

      RLVDImageName = BASE_UPLOAD_PATH + element.filename

    });
  }
  if (VideoURL) {
    VideoURL.forEach((element: any) => {
      console.log("name  ", element.filename)

      VideoName = BASE_UPLOAD_PATH + element.filename

    });
  }
  console.log(req.body.analytics);

  // const newLog = new AnalyticsLog({ ...req.body });
  const newLog = new AnalyticsLog({
    timestamp: req.body.timestamp,
    // analytics: req.body.analytics,
    CameraName: req.body.CameraName,
    location: req.body.location,
    CustomerName: req.body.CustomerName,
    Lat: req.body.Lat,
    Long: req.body.Long,
    Speed: req.body.Speed,
    VehicleType: req.body.VehicleType,
    Vehicle_Color: req.body.Vehicle_Color,
    isSpeeding: req.body.isSpeeding,
    isANPR: req.body.isANPR,
    isWrongWay: req.body.isWrongWay,
    isNoHelmet: req.body.isNoHelmet,
    isRLVD: req.body.isRLVD,
    isTripleRiding: req.body.isTripleRiding,
    VehicleMake: req.body.VehicleMake,
    vehicle_lpr_number: req.body.vehicle_lpr_number,
    vehicle_model: req.body.vehicle_model,
    LPNumber: req.body.LPNumber,
    LPImagePath: LPImageName,
    Snapshotpath: SnapshotName,
    RLVDImagePath: RLVDImageName,
    VideoPath: VideoName,
    ImagePath: imageName,
    EventType: req.body.EventType,
    Confidence: req.body.Confidence
  });

  console.log("emit", newLog)
  const insertedLog = await newLog.save();
  insertedLog['RLVDImagePath'] = `${protocol}://${ipPort}/${insertedLog.RLVDImagePath}`;
  insertedLog['VideoPath'] = `${protocol}://${ipPort}/${insertedLog.VideoPath}`;
  insertedLog['LPImagePath'] = `${protocol}://${ipPort}/${insertedLog.LPImagePath}`;
  insertedLog['Snapshotpath'] = `${protocol}://${ipPort}/${insertedLog.Snapshotpath}`;
  let detailUrl = `${protocol}://${ipPort}/search/detail/${insertedLog._id}`;
  socketIO.emit('log_inserted', insertedLog)
  return res.status(201).json({ data: insertedLog, url: detailUrl });
});

app.put(`${base_api_url}/analytics/logs/:id`, async (req: any, res: any) => {
  const { id } = req.params;
  console.log("body", req);

  const updateData = await AnalyticsLog.findOneAndUpdate({ id }, {
    timestamp: req.body.timestamp,
    // analytics: req.body.analytics,
    CameraName: req.body.CameraName,
    location: req.body.location,
    CustomerName: req.body.CustomerName,
    Lat: req.body.Lat,
    Long: req.body.Long,
    isSpeeding: req.body.isSpeeding,
    isANPR: req.body.isANPR,
    isWrongWay: req.body.isWrongWay,
    isNoHelmet: req.body.isNoHelmet,
    isRLVD: req.body.isRLVD,
    isTripleRiding: req.body.isTripleRiding,
    VehicleType: req.body.VehicleType,
    VehicleMake: req.body.VehicleMake,
    vehicle_lpr_number: req.body.vehicle_lpr_number,
    vehicle_model: req.body.vehicle_model,
    LPNumber: req.body.LPNumber
  });

  console.log("updateData  ", updateData)
  const updatedLog = await AnalyticsLog.findById(id);

  return res.status(200).json(updatedLog);
});



app.get('/api/search', async (req, res) => {
  let queryCond: { [key: string]: any } = {};

  if (req.query.CameraName) {
    queryCond.CameraName = req.query.CameraName;
  }

  if (req.query.location) {
    queryCond.location = req.query.location;
  }

  try {
    const data = await AnalyticsLog.find(queryCond);
    console.log("data ", data)
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/api/search/customer', async (req, res) => {
  let queryCond: { [key: string]: any } = {};

  if (req.query.CustomerName) {
    queryCond.CustomerName = req.query.CustomerName;
  }

  try {
    const data = await AnalyticsLog.find(queryCond);
    console.log("data ", data)
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/search/customer', async (req, res) => {
  let queryCond: { [key: string]: any } = {};

  if (req.query.CustomerName) {
    queryCond.CustomerName = req.query.CustomerName;
  }

  try {
    const data = await AnalyticsLog.find(queryCond);
    console.log("data ", data)
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});



app.get('/api/search/analytics', async (req, res) => {
  let queryCond: { [key: string]: any } = {};

  if (req.query.CustomerName) {
    queryCond.CustomerName = req.query.CustomerName;
  }

  try {
    const data = await AnalyticsLog.find(queryCond);
    console.log("data ", data)
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/api/search/challan', async (req, res) => {
  let queryCond: { [key: string]: any } = {};

  if (req.query.ChallanNo) {
    queryCond.ChallanNo = req.query.ChallanNo;
  }
  try {
    const data = await Challan.find({ 'ChallanNo': { '$regex': req.query.ChallanNo } });
    console.log("data ", data)
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});



app.put(`/challan/update/:id`, async (req: any, res: any) => {
  const { id } = req.params;
  console.log("body", req.body);

  const updateData = await Challan.update({ _id: id }, {
    Status: req.body.Status
  });

  console.log("updateData  ", updateData)
  const updatedLog = await Challan.findById(id);

  return res.status(200).json(updatedLog);
});




app.delete(`${base_api_url}/analytics/logs/:id`, async (req: any, res: any) => {
  const { id } = req.params;
  const deletedLog = await AnalyticsLog.findByIdAndDelete(id);
  return res.status(200).json(deletedLog);
});

app.get("/live", (req: any, res: any) => {
  // res.sendFile(path.join(__dirname, "views/live.ejs"));
  return res.render('live');
});

app.get("/search", (req: any, res: any) => {
  //  return res.sendFile(path.join(__dirname, "search"));
  return res.render('search');
});

app.get("/view/challan", async (req: any, res: any) => {
  console.log("challan")
  const { id } = req.params;
  const ipPort = req.get('host');
  const protocol = req.protoc

  const perPage = req.query.perPage
  const page = req.query.page

  console.log("perPage", perPage, "page ", page)


  const data = await Challan.find().sort({ "timestamp": -1 })
    .skip((perPage * page) - perPage)
    .limit(perPage)

  if (data) {
    data.forEach(logObj => {

      console.log("eeeeee", logObj.LPImageURL)

      logObj['LPImageURL'] = `${protocol}://${ipPort}/${logObj.LPImageURL}`
      logObj['EventType'] = logObj.EventType

    });
  }
  console.log("data ", data)
  return res.json(data);
  //  return res.sendFile(path.join(__dirname, "search"));
  // return res.render('challan');
});


app.get("/logout", (req: any, res: any) => {
  // return res.sendFile(path.join(__dirname, "logout"));
  return res.render('logout');
});

app.get("/challan", (req: any, res: any) => {
  // return res.sendFile(path.join(__dirname, "logout"));
  return res.render('challan');
});


app.get("/aboutus", (req: any, res: any) => {
  // return res.sendFile(path.join(__dirname, "logout"));

  return res.render('about');
});


app.get("/login", (req: any, res: any) => {
  // return res.sendFile(path.join(__dirname, "login"));
  return res.render('login');
});
app.get("/search/detail/:id", async (req: any, res: any) => {
  // return res.sendFile(path.join(__dirname, "login"));
  try {
    const { id } = req.params;
    const ipPort = req.get('host');
    const protocol = req.protocol

    const data = await AnalyticsLog.findById(id);

    // console.log("data", data);

    if (data) {
      data['RLVDImagePath'] = `${protocol}://${ipPort}/${data.RLVDImagePath}`;
      data['VideoPath'] = `${protocol}://${ipPort}/${data.VideoPath}`;
      data['LPImagePath'] = `${protocol}://${ipPort}/${data.LPImagePath}`;
      data['Snapshotpath'] = `${protocol}://${ipPort}/${data.Snapshotpath}`;

    }

    console.log("details", data);

    return res.render('detail', { data });
  } catch (error) {

    return res.render('detail', { error, message: "Cant Find the detail for requested log! " });

  }


});


app.get("/noHelmet/:id", async (req: any, res: any) => {
  // return res.sendFile(path.join(__dirname, "login"));
  try {
    const { id } = req.params;
    const ipPort = req.get('host');
    const protocol = req.protocol

    const data = await Challan.findById(id);

    // console.log("data", data);

    if (data) {
      data['RLVDImageURL'] = `${protocol}://${ipPort}/${data.RLVDImageURL}`;
      data['VideoURL'] = `${protocol}://${ipPort}/${data.VideoURL}`;
      data['LPImageURL'] = `${protocol}://${ipPort}/${data.LPImageURL}`;
      data['SnapshotURL'] = `${protocol}://${ipPort}/${data.SnapshotURL}`;

    }

    console.log("data ", data?.EventType)

    if (data?.EventType == 'RLVD') {

      return res.render('rlvd', { data });
    } else if (data?.EventType == 'TripleRiding') {

      return res.render('tripleRiding', { data });

    }
    else if (data?.EventType == 'NoHelmet') {

      return res.render('noHelmet', { data });

    }


    return res.render('about', { data });


  } catch (error) {

    return res.render('detail', { error, message: "Cant Find the detail for requested log! " });

  }


});



app.get("/challan/detail/:id", async (req: any, res: any) => {
  // return res.sendFile(path.join(__dirname, "login"));
  try {
    const { id } = req.params;
    const ipPort = req.get('host');
    const protocol = req.protocol

    const data = await Challan.findById(id);

    // console.log("data", data);

    if (data) {
      data['RLVDImageURL'] = `${protocol}://${ipPort}/${data.RLVDImageURL}`;
      data['VideoURL'] = `${protocol}://${ipPort}/${data.VideoURL}`;
      data['LPImageURL'] = `${protocol}://${ipPort}/${data.LPImageURL}`;
      data['SnapshotURL'] = `${protocol}://${ipPort}/${data.SnapshotURL}`;

    }

    console.log("details", data);

    return res.render('detail', { data });
  } catch (error) {

    return res.render('detail', { error, message: "Cant Find the detail for requested log! " });

  }


});


app.get("/challan/updatechallan/:id", (req: any, res: any) => {
  // return res.sendFile(path.join(__dirname, "login"));
  return res.render('updatechallan');
});



app.get(`/generate/challan/:id`, async (req: any, res: any) => {


  // app.get(`${base_api_url}/analytics/logs/:id`, async (req: any, res: any) => {
  const { id } = req.params;
  const ipPort = req.get('host');
  const protocol = req.protocol

  const log = await AnalyticsLog.findById(id);
  console.log("log", log)

  const challanNo = `${log?.timestamp}${log?.EventType}${log?.LPNumber}`

  //  const deletedLog = await AnalyticsLog.findByIdAndDelete(id);
  const newLog = new Challan({
    ChallanNo: challanNo,
    Status: "notpaid",
    timestamp: log?.timestamp,
    CameraName: log?.CameraName,
    LPImageURL: log?.LPImagePath,
    location: log?.location,
    CustomerName: log?.CustomerName,
    Lat: log?.Lat,
    Long: log?.Long,
    EventType: log?.EventType,
    Speed: log?.Speed,
    LPNumber: log?.LPNumber,
    Snapshotpath: log?.SnapshotURL,
    RLVDImagePath: log?.RLVDImageURL,
    VideoPath: log?.VideoURL,
  });

  console.log("emit", newLog)
  const insertedLog = await newLog.save();
  socketIO.emit('log_inserted', insertedLog)
  return res.status(201).json(insertedLog);
});
// app.get(`/generate/challan/:id`, async (req: any, res: any) => {


//   // app.get(`${base_api_url}/analytics/logs/:id`, async (req: any, res: any) => {
//   const { id } = req.params;
//   const ipPort = req.get('host');
//   const protocol = req.protocol

//   const log = await AnalyticsLog.findById(id);
//   console.log("log", log)

//   const challanNo = `${log?.timestamp}${log?.object_type}${log?.LPNumber}`

//   //  const deletedLog = await AnalyticsLog.findByIdAndDelete(id);
//   const newLog = new Challan({
//     ChallanNo: challanNo,
//     Status: "notpaid",
//     timestamp: log?.timestamp,
//     CameraName: log?.CameraName,
//     LPImageURL: log?.LPImagePath,
//     location: log?.location,
//     CustomerName: log?.CustomerName,
//     Lat: log?.Lat,
//     Long: log?.Long,
//     // EventType: log?.object_type,
//     Speed: log?.Speed,
//     LPNumber: log?.LPNumber,
//     Snapshotpath: log?.SnapshotURL,
//     RLVDImagePath: log?.RLVDImageURL,
//     VideoPath: log?.VideoURL,
//   });

//   console.log("emit", newLog)
//   const insertedLog = await newLog.save();
//   socketIO.emit('log_inserted', insertedLog)
//   return res.status(201).json(insertedLog);
// });






const port = process.env.APP_PORT
const mongoUri: any = process.env.MONGO_CONNECTION_STRING
const start = async () => {
  try {
    //mongoose.connect(config.DB,{ useNewUrlParser: true }));
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
