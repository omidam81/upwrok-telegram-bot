

var telegram = require('telegram-bot-api');
let RssFeedEmitter = require('rss-feed-emitter');
var http = require('http');
var fs = require('fs');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({ chats: []})
  .write()




let feeder = new RssFeedEmitter();
var api = new telegram({
        token: '721094854:AAGMj4UhmF29WbwNQXAyRrEKLOI1qJQPZM4',
        updates: {
        	enabled: true
    }
});


feeder.add({
    url: 'https://www.upwork.com/ab/feed/topics/atom?securityToken=1aa3bb563e03536d87b7dd06f0c22c9b6fd2c4991a37d602c995b3d106c8b0177451b3e1c104b1cfea6068e1fa5b83bd7b4aa27204dbc271af58f90d1e837762&userUid=641972342928629760&orgUid=641972342932824065',
    refresh: 2000
  });



let chat_id = '';


feeder.on('new-item', function(item) {

  
    let text = item.summary;

    let skills = text.substring(text.indexOf("<b>Skills</b>:") + "<b>Skills</b>:".length, text.indexOf("<b>Country</b>:"));
    let remian = text.substring(text.indexOf("<b>Country</b>:"));
    let country = remian.substring("<b>Country</b>:".length, remian.indexOf("<br />"));
    let links = item.link;
    console.log(chat_id);

    //////if(!chat_id) return;
    skills = skills.toLowerCase();

    let b1 = skills.indexOf("node.js") >= 0
             || skills.indexOf("c#") >= 0
             || skills.indexOf("angularjs") >= 0
             || skills.indexOf("vue.js") >= 0
             || skills.indexOf("javascript") >= 0
             || skills.indexOf("react.js") >= 0
             || skills.indexOf("jquery") >= 0
             || skills.indexOf("haskell") >= 0
             || skills.indexOf("c++") >= 0
             || skills.indexOf("delphi") >= 0
             || skills.indexOf("html") >= 0
    

    text = `${item.title} 
                ${links}`
    if(b1){
        var items =  db.get('chats')
            .map('id')
            .value()
        console.log(items)
        for(var i in items){
            console.log("items", items[i]);
            api.sendMessage({
                chat_id: items[i],
                text: text
            }, {
                "parse_mode" :'HTML'
            });
        }
       
    }
    
});



api.on('message', function(message)
{
    var id = db.get('posts')
        .find({ id: message.chat.id })
        .value()
    if(!id)
        db.get('chats')
        .push({ id: message.chat.id})
        .write()
});


var CronJob = require('cron').CronJob;
new CronJob('* * * * * 59', function() {
   console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');




http.createServer(function (req, res) {
   console.log("server started at 8080")
}).listen(3000);

