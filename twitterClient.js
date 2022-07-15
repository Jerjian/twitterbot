let Twit = require("twit")

let config = require("./config")
let T = new Twit(config)

let latestPostedStoryID;

// TickerTick response
const tweet = async ()=>{
    try{
        //get 50 of the latest META news in the last hour 
        console.log("Fetching...")
        let res = await fetch("https://api.tickertick.com/feed?q=(and (or tt:amzn tt:aapl tt:nflx tt:meta tt:goog tt:msft ) (or T:fin_news T:earnings T:market T:sec T:sec_fin))")

        let tickerTickJSON = await res.json()


        let tags;
        let tagString;
        if(!latestPostedStoryID){
            console.log("We have a new Story. Posting.. ", tickerTickJSON.stories[0].title)
            tags = tickerTickJSON.stories[0].tags
            tagString = "Tags: ";
            for (let i = 0; i < tags.length; i++) {
                tagString += `$${tags[i]} `                 
            }
            T.post('statuses/update', {status: `${tickerTickJSON.stories[0].title}\n${tagString}\nPowered by TickerTick.com ${tickerTickJSON.stories[0].url}` }, function (err, data, response) {
                console.log(data)
            })
            latestPostedStoryID = tickerTickJSON.stories[0].id
        } else if(latestPostedStoryID != tickerTickJSON.stories[0].id){
            tags = tickerTickJSON.stories[0].tags
            tagString = "Tags: ";
            for (let i = 0; i < tags.length; i++) {
                tagString += `$${tags[i]} `                 
            }
            console.log("We have a new Story. Posting.. ", tickerTickJSON.stories[0].title)
            T.post('statuses/update', {status: `${tickerTickJSON.stories[0].title}\n${tagString}\nPowered by TickerTick.com ${tickerTickJSON.stories[0].url}` }, function (err, data, response) {
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


