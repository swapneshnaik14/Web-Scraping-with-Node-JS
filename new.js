var request = require('request');
var cheerio = require('cheerio');

var url = 'https://www.olx.in/vehicles/q-ertiga/';

var array = [];

request(url, function(err, resp, body){
  $ = cheerio.load(body);
  links = $('a');
  $(links).each(function(i, link){
    var href = $(link).attr('href');
    
    array.push(href);
    console.log(array);
  });
});
