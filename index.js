const Discord = require("discord.js")
const Database = require("@replit/database")
const fetch = import('node-fetch')
const Giyu = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })
const db = new Database()

const sadWords = [
  'sad',
'depressed',
  'unhappy',
  'overwhelmed',
  'chill',
  'bot',
  'bob?',
  'hi'
]

const badwords = ['sad','sad life', 'life is sad']


db.get('mbadwords').then(mbadwords=> {if(!mbadwords || mbadwords.length < 1 ){db.set('mbadwords',badwords)}})




function updatemorebadwords(badwordsmsg){
  db.get('mbadwords')
    .then(mbadwords => {mbadwords.push([badwordsmsg])         
 db.set('mbadwords', mbadwords)
              })
}
function deletemsg(index){
  db.get('mbadwords')
    .then(mbadwords => {if (mbadwords.length > index){
      mbadwords.splice(index, 1)
      db.set('mbadwords', mbadwords)
    }
      
     })
 
}

function getQuote(){
  return fetch("https://zenquotes.io/api/random") 
 
    .then
    (res => {
    return res.json()
  })//callback function
  
    .then(data => {
    return data[0]['q'] + ' -'+ data[0]['a']//final quote after processing
 })

}


Giyu.on("ready",()=>{
  console.log(`Logged in as ${Giyu.user.tag}!!!`)
})

Giyu.on('messageCreate', msg => {
 
  
  if (msg.content === 'inspire!'){
    getQuote().then(quote => msg.channel.send(quote))
  }
  if(sadWords.some(word => 
    msg.content.includes(word))){
    db.get('mbadwords').then(mbadwords => {
      const badmouthing =      
      mbadwords[Math.floor(Math.random() * mbadwords.length)]
    msg.reply(badmouthing)
    })
    
  }
  if (msg.content.startsWith('!new')){
    badwordsmsg = msg.content.split('!new ')[1]
    updatemorebadwords(badwordsmsg)
    msg.channel.send("New insults added.")
  }
   if (msg.content.startsWith('!del')){
    index = parseInt(msg.content.split('!del ')[1])
    deletemsg(index)
    msg.channel.send("New insults deleted.")
  }
  
})

Giyu.login(process.env.TOKEN)

