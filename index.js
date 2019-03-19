

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


const adapter2 = new FileSync('db2.json')
const db2 = low(adapter2)
db2.defaults({ chats: []})
  .write()


var api2 = new telegram({
    token: '800595712:AAEr1Dg04kuH_UzRQdsl1Vtp8sz24N5X4KE',
    updates: {
        enabled: true
    }
});



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
             || skills.indexOf(".net") >= 0
    

    text = `${item.title} 
                ${links}`
    if(b1){
        var items =  db.get('chats')
            .map('id')
            .value()
        for(var i in items){
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


api2.on('message', function(message)
{
    var id = db2.get('chats')
        .find({ id: message.chat.id })
        .value();
    if(!id)
        db2.get('chats')
        .push({ id: message.chat.id})
        .write()
});


var request = require("request")

var time_submitted = -1;
function getNewUrls (){
    console.log("hererererer");
    request({
        url: `https://www.freelancer.com/api/projects/0.1/projects/active/?compact=true&full_description=true&job_details=true&jobs%5B%5D=690&jobs%5B%5D=106&jobs%5B%5D=500&jobs%5B%5D=9&jobs%5B%5D=247&jobs%5B%5D=323&jobs%5B%5D=3&jobs%5B%5D=759&jobs%5B%5D=1314&jobs%5B%5D=69&keywords=&limit=10&min_avg_hourly_rate=18&min_avg_price=500&offset=0&project_types%5B%5D=fixed&project_types%5B%5D=hourly&query=&sort_field=submitdate&upgrade_details=true&user_details=true&user_employer_reputation=true&user_status=true`,
        json: true
    }, function (error, response, body) {

        //console.log(body.result);
        if (!error && response.statusCode === 200) {
            var res = body.result.projects.sort(
                (a, b)=> {
                    return a.time_submitted - b.time_submitted;
                }
            ).filter(a=> a.time_submitted > time_submitted);
            if(res.length > 0)
                time_submitted = res.slice(-1)[0].time_submitted;
            for(var p in res)
            {
               newItem(res[p]);
            }
        }
    });
}

var lastTimeCheck = -1;
temp_time_updated = -1;
function newItem (item){
    var text = `${item.title} 
    https://www.freelancer.com/projects/${item.seo_url}`
            
        var items =  db2.get('chats')
            .map('id')
            .value()
        for(var xi in items){
            console.log("xxxxxx", xi);
            api2.sendMessage({
                chat_id: items[xi],
                text: text
            }, {
                "parse_mode" :'HTML'
            });
        }
    }


var CronJob = require('cron').CronJob;
new CronJob('30 * * * * *', function() {
   getNewUrls();
}, null, true, 'America/Los_Angeles');




var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname + "/public/")).listen(8000, function(){
    console.log('Server running on 81...');
});