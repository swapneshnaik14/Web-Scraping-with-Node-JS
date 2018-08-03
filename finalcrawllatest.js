var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var url1 = "mongodb://localhost:27017/";
var MongoClient = require('mongodb').MongoClient;


var START_URL = "https://www.olx.in/vehicles/q-ertiga/";
var SEARCH_WORD = "stemming";
var MAX_PAGES_TO_VISIT = 49;

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var obj = {
    table: []
  };
var url = new URL(START_URL);
var baseUrl = url.protocol + "//" + url.hostname;

pagesToVisit.push(START_URL);
crawl();

function crawl() {
  if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
    console.log("Reached max limit of number of pages to visit.");
    MongoClient.connect(url1, function(err, db) {
        if (err) throw err;
      
        var dbo = db.db("block");
        dbo.collection("records").insertOne(obj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      });
    
    return;
  }
  var nextPage = pagesToVisit.pop();
  if (nextPage in pagesVisited) {
    // We've already visited this page, so repeat the crawl
    crawl();
  } else {
    // New page we haven't visited
    visitPage(nextPage, crawl);
  }
}

function visitPage(url, callback) {
  // Add page to our set
  pagesVisited[url] = true;
  numPagesVisited++;

  // Make the request
  console.log("Visiting page " + url);
  request(url, function(error, response, body) {
     // Check status code (200 is HTTP OK)
     console.log("Status code: " + response.statusCode);
     if(response.statusCode !== 200) {
       callback();
       return;
     }
     // Parse the document body
     var $ = cheerio.load(body);
     


     $('#offers_table .offer').each(function( index ) {
        var title = $(this).find('.link.linkWithHash').text().trim();
        var price = $(this).find('.price').text().trim();
       
    
        var link = $(this).find('.linkWithHash img').attr('src');
        var location = $(this).find('.color-9').text().trim();
        
        obj.table.push({url,title,price,location,link});
        
    });
       
    
     
       collectInternalLinks($);
      
      
     
       // In this short program, our callback is just calling crawl()
       callback();
     
  });
 
  
}



function collectInternalLinks($) {
    var relativeLinks = $("a[href^='https://www.olx.in/vehicles/q-ertiga/?page=']");
    
    relativeLinks.each(function() {
        
        pagesToVisit.push($(this).attr('href'));
       
  
    });
    
}





/**MongoClient.connect(url1, function(err, db) {
    if (err) throw err;
  
    var dbo = db.db("block");
    dbo.collection("records").insertOne(obj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });**/
