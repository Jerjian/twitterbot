// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url)

let Twit = require("twit")
import fetch from "node-fetch";

let config = require("./config.cjs")
let T = new Twit(config)

let latestPostedStoryID;

// TickerTick response
const tweet = async ()=>{
    try{
        //get 50 of the latest META news in the last hour 
        console.log("Fetching...")
        let res = await fetch("https://api.tickertick.com/feed?q=(and (or tt:amzn tt:aapl tt:nflx tt:meta tt:goog tt:msft) (or T:fin_news T:earnings T:market T:sec T:sec_fin))")

        let tickerTickJSON = await res.json()
        
        let title = tickerTickJSON.stories[0].title
        let description = tickerTickJSON.stories[0].description
        description = "\nDesc: " + description
        let url = tickerTickJSON.stories[0].url

        let remainingChar = 280 - title.length - url.length
        
        let tags;
        let tagString;
        tags = tickerTickJSON.stories[0].tags
        for (let i = 0; i < tags.length; i++) {
            tagString += `$${tags[i].toUpperCase()} `     
            remainingChar -= tagString.length           
        }

        remainingChar -= 30 //a small buffer for the spaces

        if(remainingChar > 20) {
            description.slice(0, remainingChar)
        }else{
            description = ""
        }

        if(!latestPostedStoryID){
            console.log("We have a new Story. Posting.. ", title)
            T.post('statuses/update', {status: `${title}${description}\n${tagString}\nPowered by TickerTick.com${url}` }, function (err, data, response) {
                console.log(data)
            })
            latestPostedStoryID = tickerTickJSON.stories[0].id
        } else if(latestPostedStoryID != tickerTickJSON.stories[0].id){
            console.log("We have a new Story. Posting.. ", title)
            T.post('statuses/update', {status: `${title}${description}\n${tagString}\nPowered by TickerTick.com ${url}` }, function (err, data, response) {
                console.log(data)
            })
            latestPostedStoryID = tickerTickJSON.stories[0].id
        }
    }
    catch(e){
        console.log(e)
    }
}
tweet()
setInterval(tweet,1000*30)


