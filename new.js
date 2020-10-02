var request = require('request');
var cheerio = require('cheerio');
//add url to extract the content
var url = 'https://www.olx.in/vehicles/q-ertiga/';
var array = [];

request(url, function(err, resp, body){
  $ = cheerio.load(body);
  links = $('a');
  $(links).each(function(i, link){
    var href = $(link).attr('href');   
    array.push(href);
  });
});
