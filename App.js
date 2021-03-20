const axios = require('axios').default;
const Discord = require('discord.js');
require('dotenv').config();

const client = new Discord.Client();
const DAVITO_GIF ="https://serpapi.com/searches/c7bf709377b241ab/60561a022bc7d86673842301.json";
const DAVITO_IMG = "https://serpapi.com/searches/57b9a61ed8fdb44f/605633606073936b008a2781.json";
const COMPLIMENT_URL = 'https://complimentr.com/api';
let PREFIX = "";
let USE_GIFS = true;

client.on('ready', () => {
  console.log('Bot is up and running');
});

const constructHelp =(() => {
  const text = `
    List of commands:

    "summon god" - Spawn a compliment of Danny Davito complete with a picture or gif of him.

    "changePrefix" <new value> - set a prefix for the bot commands. 
    
    "use danny gifs <true or false>" - Display gifs of Danny Davito instead of images
  `
  const dannyHelp = new Discord.MessageEmbed()
  .setColor('#ff00ff')
  .setTitle('Help from Davito')
  .setDescription(text)
  .setImage('https://i.kym-cdn.com/photos/images/newsfeed/001/402/192/398.jpg')
  .setFooter("🥚");
  
  return (dannyHelp);
})
const constructDani = (async () => {
  const quote= await axios.get(COMPLIMENT_URL);

  const davitoData= await axios.get(USE_GIFS ? DAVITO_GIF : DAVITO_IMG);
  const imgSet = davitoData.data.images_results.map(img => img.original);

  const daniObj = new Discord.MessageEmbed()
    .setColor('#ff00ff')
    .setTitle('Davito Says....')
    .setURL('https://i.imgur.com/0MUnM21.gif')
    .setDescription( `${quote.data.compliment.charAt(0).toUpperCase() + quote.data.compliment.slice(1)}`)
    .setImage(imgSet[Math.floor(Math.random() * Math.floor(imgSet.length - 1))])
    .setFooter("💖💖💖");
  
  return daniObj;
});

client.on('message', async ({content, channel, author}) => {
  if(author.bot){
    return;
  }

  if(!PREFIX || content.startsWith(PREFIX)){
    const command = PREFIX ? content.substring(content.indexOf(PREFIX) + 1) : content;

    if(command.includes('summon god')){
      const davitoObj = await constructDani();
      channel.send({ embed: davitoObj });
    }

    else if(command.includes('changePrefix')){
      PREFIX = command.split('changePrefix')[1].trim();
      const message = PREFIX ? 
        `Prefix now set to: ${PREFIX}` :
        'Prefix unset'
      channel.send(message);

    }

    else if(command.includes('use danny gifs')){
      const varCheck = command.split('use danny gifs')[1].trim().toLowerCase();
      if(varCheck === "true" || varCheck === "false"){
        USE_GIFS = varCheck === "true";
        channel.send(`Will now display: ${USE_GIFS ? 'gifs' : 'images'} of Danny.`);
      } else{
        channel.send('Incorrect value: Please use either "true" or "false" to set this command');
      }
    }
    
    else if(command === "help"){
      const dannyHelp = constructHelp();
      channel.send({ embed: dannyHelp });
    }
  }
})

client.login(process.env.BOT_TOKEN);