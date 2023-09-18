const express = require("express");
const Diamonds = require("../../DB/Schema/DiamondSchema");
const bodyParser = require("body-parser");
const WebSocket = require("ws");
const http = require("http");
const Router = express.Router();
const DeletedDiamonds = require("../../DB/Schema/DeletedDiamonds")

Router.get("/diamonds", async (req, res, next) => {
  const query = req.query;
  const pageNumber = query.pageNumber || 1;
  const numberOfEntries = 100;
  const queryMapper = {};
  
  if (query.source) {
    queryMapper.source = query.source;
  }

  if (query.natural) {
    queryMapper.natural = query.natural === "true";
  }

  if (query.stock) {
    queryMapper.lotNo = query.stock;
  }
  if (query.stoneId) {
    queryMapper.stoneId = query.stoneId;
  }

  console.log(queryMapper);

  const count = await Diamonds.countDocuments(queryMapper);
  const data = await Diamonds.find(queryMapper)
    .skip((pageNumber - 1) * numberOfEntries)
    .limit(numberOfEntries)
    .lean();
  console.log("found");
  res.status(200).json({ data, count });
});

Router.post("/diamonds", bodyParser.json(), async (req, res, next) => {
  const params = req.query;
  const query = req.body;
  const pageNumber = parseInt(params.pageNumber) || 1;
  const pageSize = 100;

  // params to query
  console.log(params);
  if (params.source) {
    query.source = params.source;
  }

  if (params.stock) {
    queryMapper.lotNo = params.stock;
  }
  if (params.stoneId) {
    query.stoneId = params.stoneId;
  }
  // Map boolean parameters
  if (typeof params.colored === "string") {
    query.colored = params.colored === "true";
  }

  if (typeof params.natural === "string") {
    query.natural = params.natural === "true";
  }

  // Define sorting options
  const sortOptions = {};

  if (params.sorting === "true") {
    const direction = params.direction === "asc" ? 1 : -1;
    let sortingParameter = params.sortingParameter;

    // Map sorting parameters
    if (sortingParameter === "cut") {
      sortingParameter = "scut";
    } else if (sortingParameter === "polish") {
      sortingParameter = "spolish";
    } else if (sortingParameter === "symmetry") {
      sortingParameter = "ssym";
    } else if(sortingParameter === "clarity"){
      sortingParameter = "sclarity"
    }


    sortOptions[sortingParameter] = direction;
  }

  try {
    const count = await Diamonds.countDocuments(query);
    const skip = (pageNumber - 1) * pageSize;
    console.log("this is final send to db");
    console.log(query);
    const dataQuery = Diamonds.find(query).lean().skip(skip).limit(pageSize).allowDiskUse(true);

    // Apply sorting if necessary
    if (Object.keys(sortOptions).length > 0) {
      dataQuery.sort(sortOptions);
    }

    const data = await dataQuery;

    res.status(200).json({ data, count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



Router.get("/Search", async (req, res, next) => {
  const params = req.query;
  const skip = 100;
  const pageNumber = params.pageNumber - 1 || 0;
  if (params.value) {
    const SearchValue = params.value;
    const check = parseInt(SearchValue);
    if (isNaN(check)) {
      const query = {
        $or: [
          {
            "source": { $regex: new RegExp(SearchValue, "i") } // Case-insensitive regex
          },
          {
            "stoneId": { $regex: new RegExp(SearchValue, "i") }
          },
          {
            "lotNo": { $regex: new RegExp(SearchValue, "i") }
          },
          {
            "shape": { $regex: new RegExp(SearchValue, "i") }
          },
          {
            "color": { $regex: new RegExp(SearchValue, "i") }
          },
          {
            "clarity": { $regex: new RegExp(SearchValue, "i") }
          },
          {
            "lab": { $regex: new RegExp(SearchValue, "i") }
          }
        ]
      };
      const count = await Diamonds.countDocuments(query);
      const data = await Diamonds.find(query).skip(skip * pageNumber).limit(skip).lean();
      res.status(200).json({ data, count });
    } else {
      const query = {
        $or: [
          {
            "carat": SearchValue
          },
          {
            "amount": SearchValue
          },          
          {
            "stoneId":  SearchValue
          },
          {
            "lotNo": SearchValue
          }, 
        ]
      };
      const count = await Diamonds.countDocuments(query);
      const data = await Diamonds.find(query).skip(skip * pageNumber).limit(skip).lean();
      res.status(200).json({ data, count });
    }
  } else {
    res.sendStatus(200);
  }
});





Router.get("/diamonds/sort/:path", async (req, res, next) => {
  const path = req.params.path;
  const data = await Diamonds.find()
    .sort({ carat: path })
    .allowDiskUse(true)
    .limit(100);
  res.status(200).json(data);
});

Router.get("/data-stream", (req, res) => {
  const app = express();
  const server = http.createServer(app);
  console.log("called");
  const wss = new WebSocket.Server({ server });
  wss.on("connection", (ws) => {
    console.log("Client connected to WebSocket");

    // Fetch data from MongoDB and send it as WebSocket messages
    Diamonds.find()
      .cursor()
      .eachAsync((doc) => {
        ws.send(JSON.stringify(doc));
      })
      .then(() => {
        console.log("Data streaming complete");
      });

    // Clean up on client disconnect
    ws.on("close", () => {
      console.log("Client disconnected from WebSocket");
    });
  });
});


Router.delete("/:id" , async (req , res)=>{
  const stoneId = req.params.id;
  console.log("deleted Req called")
  
  await Diamonds.deleteOne({"stoneId" : stoneId}).then(()=>{
    console.log("Deleted");
    DeletedDiamonds.create({"stoneId" : stoneId})
    res.sendStatus(200);
  }).catch((err)=>{
    console.log(err);
    res.sendStatus(500);
  });
  


})

module.exports = Router;
