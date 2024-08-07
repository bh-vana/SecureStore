/*require("dotenv").config()
const mongoose = require("mongoose")
const multer = require("multer")
const express = require("express")
const bcrypt = require("bcrypt-nodejs")
const File = require("./models/File")

const app = express()
app.use(express.urlencoded({ extended: true}))
const upload = multer({ dest: "uploads" })
mongoose.connect(process.env.DATABASE_URL)
app.set("view engine", "ejs")

app.get("/", (req, res) => {
  res.render("index")
})

app.post("/upload", upload.single("file"),async (req,res) => {
  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname
  }
if (req.body.password != null && req.body.password !== "") {
  fileData.password = await bcrypt.hash(req.body.password, 10)
}
const file=await File.create(fileData)
res.render("index", {fileLink: `${req.headers.origin}/file/${file.id}` })

})
app.get("/file/:id",async (req,res) => {

const file= await File.findById(req.params.id)




file.downloadCount++
await file.save()
console.log(file.downloadCount)
res.download(file.path,file.originalName)

})
app.listen(8080)*/

/*-----
require("dotenv").config()
const multer = require("multer")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt-nodejs")
const File = require("./models/File")

const express = require("express")
const app = express()
app.use(express.urlencoded({ extended: true }))

const upload = multer({ dest: "uploads" })

mongoose.connect(process.env.DATABASE_URL)

app.set("view engine", "ejs")

app.get("/", (req, res) => {
  res.render("index")
})

app.post("/upload", upload.single("file"), async (req, res) => {
  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname,
  }
  if (req.body.password != null && req.body.password !== "") {
    fileData.password = await bcrypt.hash(req.body.password, 10)
  }

  const file = await File.create(fileData)

  res.render("index", { fileLink: `${req.headers.origin}/file/${file.id}` })
})

app.route("/file/:id").get(handleDownload).post(handleDownload)

async function handleDownload(req, res) {
  const file = await File.findById(req.params.id)

  if (file.password != null) {
    if (req.body.password == null) {
      res.render("password")
      return
    }

    if (!(await bcrypt.compare(req.body.password, file.password))) {
      res.render("password", { error: true })
      return
    }
  }

  file.downloadCount++
  await file.save()
  console.log(file.downloadCount)

  res.download(file.path, file.originalName)
}



app.listen(8081)

*/

/*
require("dotenv").config();
const multer = require("multer");
const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const File = require("./models/File");
const app = express()

const upload = multer({ dest: "uploads" })
mongoose.connect(process.env.DATABASE_URL)
app.set("view engine", "ejs")

app.get("/", (req, res) => {
  res.render("index")
})
app.post("/upload",upload.single("file"),async (req,res)=>{
  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname,
    
  }
  if (req.body.password != null && req.body.password !== "") {
    fileData.password =  await bcrypt.hash(req.body.password, 10)
  }

  const file = await  File.create(fileData)
  console.log(file)
  res.send(file.originalName)

  //res.render("index", { fileLink: `${req.headers.origin}/file/${file.id}` })

})
app.listen(process.env.PORT,()=>{
  console.log(`server is on :${process.env.PORT}`);
})*/

// ----------(localhost 3000)TO RUN USE npm run start----------
require("dotenv").config();
const multer = require("multer");
const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt-nodejs"); // Using bcrypt-nodejs instead of bcrypt
const File = require("./models/File");
const app = express();
app.use(express.urlencoded({ extended: true}))

const upload = multer({ dest: "uploads" });
mongoose.connect(process.env.DATABASE_URL);
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", upload.single("file"), async (req, res) => {
  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname,
  };

  if (req.body.password != null && req.body.password !== "") {
    try {
      const hashedPassword = bcrypt.hashSync(req.body.password); // Synchronously hash the password
      fileData.password = hashedPassword;
    } catch (error) {
      console.error("Error hashing password:", error);
      return res.status(500).json({ error: "Error hashing password" });
    }
  }

  try {
    const file = await File.create(fileData);
    res.render("index", { fileLink: `${req.headers.origin}/file/${file.id}` })
  } catch (error) {
    console.error("Error creating file record:", error);
    res.status(500).json({ error: "Error creating file record" });
  }
});

app.route("/file/:id").get(handleDownload).post(handleDownload)


async function handleDownload(req,res){
  const file = await File.findById(req.params.id)

  if (file.password != null) {
   if (req.body.password == null) {
     res.render("password")
     return
   }

  if (!( bcrypt.compareSync(req.body.password, file.password))) {
     res.render("password", { error: true })
     return
   }
 }
  file.downloadCount++
  await file.save()
  console.log(file.downloadCount)
  res.download(file.path,file.originalName)
}

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
