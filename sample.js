var request = require('request');
var cheerio = require('cheerio');
var serialNumber = require('serial-number');
var fs = require('fs');
var url = "mongodb://localhost:27017/";
var MongoClient = require('mongodb').MongoClient;
var obj = {
  table: []
};


request("https://www.olx.in/vehicles/q-ertiga/", function(error, response, body) {
  if(error) {
    console.log("Error: " + error);
  }
  console.log("Status code: " + response.statusCode);

  var $ = cheerio.load(body);

  $('#offers_table .offer').each(function( index ) {
    var title = $(this).find('.link.linkWithHash').text().trim();
    var price = $(this).find('.price').text().trim();
   

    var link = $(this).find('.linkWithHash img').attr('src');
    var location = $(this).find('.color-9').text().trim();
    obj.table.push({title,price,location,link});
   
     
    
   
    //fs.appendFileSync('hackernews.json', "Title:"+title + '\n' + "price:"+price + '\n' + "link:"+link + '\n');
  });

  
  
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
  
    var dbo = db.db("block");
    dbo.collection("records").insertOne(obj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
}); 

