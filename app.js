require("dotenv").config();
const Discord = require('discord.js');
const client = new Discord.Client();
const Pornsearch = require('pornsearch');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  const fullContents = message.content.trim().split(" ");

  if (message.author.bot) {return false};
  if (fullContents[0] !== ".porn") {return false};

  // BOT INTRODUCTION

  if (fullContents.length === 1) {
    const introduction = new Discord.RichEmbed()
    .setAuthor("Ahri BOT", "https://i.redd.it/ztufjdppq8r11.jpg")
    .addField("Usage", "Ahri bot is a bot to request some porn GIFs or Videos.\nTo request porn GIF, send `.porn [SEARCH QUERY]`.\nTo request Video, send `.porn -v [SEARCH QUERY]`.")
    .addField("NOTICE:", "This bot only works in NSFW channel.\nHave fun!")
    .setColor(0xEA2027);

    message.channel.send(introduction);

    return false;
  };

  // REJECT POSTS NOT FROM NSFW CHANNEL

  if (!message.channel.nsfw) {return false};

  // REQUESTS VIDEO / GIFS

  if (fullContents[1] === "-v") {
    getPornVideo(fullContents.slice(2, fullContents.length).join(" "))
    .then(video => message.channel.send(video));
  } else {
    getPornGif(fullContents.slice(1, fullContents.length).join(" "))
    .then(gif => message.channel.send(gif));
  };
});

async function getPornGif(query) {
  const embedMessage = new Discord.RichEmbed();

  return Pornsearch.search(query)
  .gifs()
  .then(gifs => {
    const randomGif = gifs[Math.floor(Math.random() * Math.floor(gifs.length))];

    embedMessage
    .setTitle(randomGif.title)
    .setImage(randomGif.url)
    .setColor(0xEA2027);

    return embedMessage;
  })
  .catch(err => {
    console.error(err);
    return "No GIFs found...";
  });
};

async function getPornVideo(query) {
  const embedMessage = new Discord.RichEmbed();

  return Pornsearch.search(query)
  .videos()
  .then(videos => {
    videoList = videos;
    videoList.some(function(v, i){
      if (v.title.match("Ads By Traffic Junky")) videoList.splice(i,1);
    });
    const randomVideo = videoList[Math.floor(Math.random() * Math.floor(videoList.length))];

    embedMessage
    .setTitle(randomVideo.title)
    .setURL(randomVideo.url)
    .setDescription(randomVideo.duration)
    .setImage(randomVideo.thumb)
    .setColor(0xEA2027);

    return embedMessage;
  })
  .catch(err => {
    console.error(err);
    return "No videos found...";
  });
};

client.login(process.env.BOT_TOKEN);
client.on('error', console.error);
