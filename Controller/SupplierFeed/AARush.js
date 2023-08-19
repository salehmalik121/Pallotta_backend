const axios = require("axios");
const DiamondModel = require("../../DB/Schema/DiamondSchema");
const mongoose = require("mongoose");
const aadata = require("../../aa.json");
const { parseNumbers } = require("xml2js/lib/processors");

const SchemaMapping = async (fetchedData)=>{
    const mappedArray = [];
    await fetchedData.forEach(element => {

        const id = new mongoose.Types.ObjectId(parseInt(element["Certificate #"]));

        const mappedObj = {
            _id: id,
            stoneId : element["Certificate #"],
            source: "AARush", // Update with your source
            lotNo: element["Lot #"],
            shape: element.Shape,
            color: element.Color,
            clarity: element.Clarity,
            cut: element["Cut Grade"],
            polish: element.Polish,
            symmetry: element.Symmetry,
            fluorescence: element.Fluor,
            carat: parseFloat(element["Weight "]),
            discountPercent: parseFloat(element.offRaportPercent) || 0,
            pricePerCarat: parseFloat(element["Price/Ct"]),
            amount: parseFloat(element.price),
            lab: element.Lab,
            measurement: `${element.Length} x ${element.Width} x ${element.Depth}`,
            totalDepthPercent: parseFloat(element["Depth %"]),
            tablePercent: parseFloat(element["Table %"]),
            girdle: element.Girdle,
            culet: element.Culet,
            comments: element["Description/Comments"],
            certificatePath: element["Cert Link"],
            Inscription: element["Inscription #"],
            length: parseFloat(element.Length),
            width: parseFloat(element.Width),
            depth: parseFloat(element.Depth),
            StoneType: "Lab Created", // Update with the appropriate stone type
            labReportComment: element["Description/Comments"], // Set this field as needed
            natural: false,
            image : element["Diamond Image"],
            video : element.Video
        }


        if(mappedObj.stoneId===" " || mappedObj.stoneId==="" || mappedObj.carat < 0.25 || mappedObj.carat > 25){

        }else{
            mappedArray.push(mappedObj);
        }
       

    });

    
    return mappedArray;
}

const dataFetching = async (apiLink)=>{


    const userName = "pallotta_rishab@labdiamondinventory.com";
    const password = "hQPlQ@za#I1@d9g&b";

    const base64Credentials = Buffer.from(`${userName}:${password}`).toString('base64');

    const headers = {
        'Authorization': `Basic ${base64Credentials}`
      };
    axios.get(apiLink , {
        headers
    }).then(async (fetch)=>{
        const fetchedData = fetch.data.data;
        if(fetchedData.length === 0 || fetch.data.next_page_url === null ){
            return ;
        }else{
        const mappedArray = await SchemaMapping(fetchedData);
        console.log(mappedArray[0]);
       await  DiamondModel.create(mappedArray);
        dataFetching(fetch.data.next_page_url);
        }


    }).catch((err)=>{
        console.log(err);
    })




    // const mappedArray = await SchemaMapping(aadata.data);
    // console.log(mappedArray[0]);
    // await  DiamondModel.create(mappedArray);

}

exports.MapData =  async (req , res)=>{


    await DiamondModel.deleteMany({"source" : "AARush"});
   await dataFetching("https://labdiamondinventory.com/api/inventory/6620b8c37cbf77");
   res.status(200);

}

//TODO: create function to merge all pages and get data
exports.fetchJeniData = async ()=>{
    const fetch = await axios.get("http://3.110.23.80/OsamProvideStock.svc/GetStock");
    const mappedArray = await SchemaMapping(fetch.data.GetStockResult.Data)

    return mappedArray;
}

