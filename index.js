
/*Why does my code work? I don’t know. Why does my code break? I also don’t know.*/

const fs = require('fs');
const zlib = require('zlib');
const { session } = require("./settings");


async function authenticationn() {
  try {
    const credsPath = "./session/creds.json";

   
    if (!fs.existsSync(credsPath)) {
      console.log("Connecting...");

      
      const [header, b64data] = session.split(';;;');

      
      if (header === "KEITH" && b64data) {
        
        let compressedData = Buffer.from(b64data.replace('...', ''), 'base64');

       
        let decompressedData = zlib.gunzipSync(compressedData);

       
        fs.writeFileSync(credsPath, decompressedData, "utf8");
      } else {
        throw new Error("Invalid session format");
      }
    }
    
    else if (session !== "zokk") {
      console.log("Updating existing session...");

    
      const [header, b64data] = session.split(';;;');

      
      if (header === "KEITH" && b64data) {
        
        let compressedData = Buffer.from(b64data.replace('...', ''), 'base64');

       
        let decompressedData = zlib.gunzipSync(compressedData);

       
        fs.writeFileSync(credsPath, decompressedData, "utf8");
      } else {
        throw new Error("Invalid session format");
      }
    }
  } catch (error) {
    console.log("Session is invalid: " + error.message);
    return;
  }
}


authenticationn();

//Why do we call it "open source" when it feels more like "open wounds"?🗿🗿

//Because sharing is caring... and crying is healing🗿🗿



const {
  default: KeithConnect, BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent,
  generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType, useMultiFileAuthState,
  DisconnectReason, makeInMemoryStore, downloadContentFromMessage, jidDecode
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const { Boom } = require("@hapi/boom");
//const fs = require("fs");
const FileType = require("file-type");
const { exec } = require("child_process");
const chalk = require("chalk");
const express = require("express");
//const textToSpeech = require('@google-cloud/text-to-speech');
const { DateTime } = require("luxon");
const util = require("util");
const speed = require("performance-now");
const { smsg } = require('./lib/smsg');
const {
  smsgsmsg, formatp, tanggal, formatDate, getTime, sleep, clockString,
  fetchJson, getBuffer, jsonformat, antispam, generateProfilePicture, parseMention,
  getRandom, fetchBuffer,
} = require("./lib/botFunctions.js");

const { TelegraPh, UploadFileUgu } = require("./lib/toUrl");
const uploadtoimgur = require("./lib/Imgur");

const { sendReply, sendMediaMessage } = require("./lib/context");
const ytmp3 = require("./lib/ytmp3");
const path = require("path");
const { commands, totalCommands } = require("./commandHandler");

const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require("./lib/exif");
const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });
const daddy = "254769365617@s.whatsapp.net";

const {
  autoview, autostatusreply, autostatusmsg, permit, autoread, botname, chatbot, timezone, autobio, mode, anticallmsg, reactemoji, prefix, presence,
  mycode, author, antibad, autodownloadstatus, packname, url, voicechatbot2, gurl, herokuAppname, greet, greetmsg, herokuapikey, anticall, dev, antilink, gcpresence, antibot, antitag, antidelete, autolike, voicechatbot
} = require("./settings");

const groupEvents = require("./groupEvents.js");
const axios = require("axios"); // Added axios import
const googleTTS = require('google-tts-api'); // Added Google TTS import



const app = express();
const port = process.env.PORT || 10000;

// Anti-delete functionality
const baseDir = 'message_data';
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir);
}

function loadChatData(remoteJid, messageId) {
  const chatFilePath = path.join(baseDir, remoteJid, `${messageId}.json`);
  try {
    const data = fs.readFileSync(chatFilePath, 'utf8');
    return JSON.parse(data) || [];
  } catch (error) {
    return [];
  }
}

function saveChatData(remoteJid, messageId, chatData) {
  const chatDir = path.join(baseDir, remoteJid);

  if (!fs.existsSync(chatDir)) {
    fs.mkdirSync(chatDir, { recursive: true });
  }

  const chatFilePath = path.join(chatDir, `${messageId}.json`);

  try {
    fs.writeFileSync(chatFilePath, JSON.stringify(chatData, null, 2));
  } catch (error) {
    console.error('Error saving chat data:', error);
  }
}

function handleIncomingMessage(message) {
  const remoteJid = message.key.remoteJid;
  const messageId = message.key.id;

  const chatData = loadChatData(remoteJid, messageId);
  chatData.push(message);
  saveChatData(remoteJid, messageId, chatData);
}

async function handleMessageRevocation(client, revocationMessage) {
  const remoteJid = revocationMessage.key.remoteJid;
  const messageId = revocationMessage.message.protocolMessage.key.id;

  const chatData = loadChatData(remoteJid, messageId);
  const originalMessage = chatData[0];

  if (originalMessage) {
    const deletedBy = revocationMessage.participant || revocationMessage.key.participant || revocationMessage.key.remoteJid;
    const sentBy = originalMessage.key.participant || originalMessage.key.remoteJid;

    if (deletedBy.includes(client.user.id.split('@')[0]) || sentBy.includes(client.user.id.split('@')[0])) return;

    const delfrom = process.env.DELETEMSGSENDTO ? `${process.env.DELETEMSGSENDTO}@s.whatsapp.net` : remoteJid;

    const deletedByFormatted = `@${deletedBy.split('@')[0]}`;
    const sentByFormatted = `@${sentBy.split('@')[0]}`;

    let notificationText = `*👻 I got you 👻*\n\n` +
      `   *Deleted by:* ${deletedByFormatted}\n` +
      `   *Sent by:* ${sentByFormatted}\n\n`;

    if (originalMessage.message?.conversation) {
      // Text message
      const messageText = originalMessage.message.conversation;
      notificationText += `   *Message Text:* \`\`\`${messageText}\`\`\``;
      await client.sendMessage(delfrom, { text: notificationText });
    } else if (originalMessage.message?.imageMessage) {
      // Image message
      const buffer = await client.downloadMediaMessage(originalMessage);
      await client.sendMessage(delfrom, { image: buffer });
      await client.sendMessage(delfrom, { text: notificationText });
    } else if (originalMessage.message?.videoMessage) {
      // Video message
      const buffer = await client.downloadMediaMessage(originalMessage);
      await client.sendMessage(delfrom, { video: buffer });
      await client.sendMessage(delfrom, { text: notificationText });
    } else if (originalMessage.message?.stickerMessage) {
      // Sticker message
      const buffer = await client.downloadMediaMessage(originalMessage);
      await client.sendMessage(delfrom, { sticker: buffer });
      await client.sendMessage(delfrom, { text: notificationText });
    } else if (originalMessage.message?.documentMessage) {
      // Document message
      const fileName = originalMessage.message.documentMessage.fileName || 'file';
      const buffer = await client.downloadMediaMessage(originalMessage);
      await client.sendMessage(delfrom, { document: buffer, fileName: fileName });
      await client.sendMessage(delfrom, { text: notificationText });
    } else if (originalMessage.message?.audioMessage) {
      // Audio message (including PTT)
      const buffer = await client.downloadMediaMessage(originalMessage);
      const isPTT = originalMessage.message.audioMessage.ptt === true;
      await client.sendMessage(delfrom, { audio: buffer, ptt: isPTT, mimetype: 'audio/mpeg', fileName: `${messageId}.mp3` });
      await client.sendMessage(delfrom, { text: notificationText });
    } else if (originalMessage.message?.extendedTextMessage) {
      // Extended text message (quoted messages)
      const messageText = originalMessage.message.extendedTextMessage.text;
      notificationText += `   *Message Text:* \`\`\`${messageText}\`\`\``;
      await client.sendMessage(delfrom, { text: notificationText });
    }
  }
}
let repliedContacts = new Set();
async function startKeith() {
  const { saveCreds, state } = await useMultiFileAuthState("session");
  const client = KeithConnect({
    logger: pino({ level: "silent" }),
    printQRInTerminal: true,
    version: [2, 3000, 1015901307],
    browser: ["KEITH-MD", "Safari", "3.0"],
    fireInitQueries: false,
    shouldSyncHistoryMessage: true,
    downloadHistory: true,
    syncFullHistory: true,
    generateHighQualityLinkPreview: true,
    markOnlineOnConnect: true,
    keepAliveIntervalMs: 30000,
    auth: state,
    getMessage: async (key) => {
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id);
        return msg.message || undefined;
      }
      return { conversation: "HERE" };
    },
  });

  store.bind(client.ev);

  if (autobio === "true") {
    setInterval(() => {
      const date = new Date();
      client.updateProfileStatus(
        `${botname} is active 24/7\n\n${date.toLocaleString("en-US", { timeZone: "Africa/Nairobi" })} It's a ${date.toLocaleString("en-US", { weekday: "long", timeZone: "Africa/Nairobi" })}.`
      );
    }, 10 * 1000);
  }

  let lastTextTime = 0;
  const messageDelay = 5000;

  client.ev.on('call', async (callData) => {
    if (anticall === 'true') {
      const callId = callData[0].id;
      const callerId = callData[0].from;

      await client.rejectCall(callId, callerId);

      const currentTime = Date.now();
      if (currentTime - lastTextTime >= messageDelay) {
        await client.sendMessage(callerId, {
          text: anticallmsg
        });
        lastTextTime = currentTime;
      } else {
        console.log('Message skipped to prevent overflow');
      }
    }
  });

  client.ev.on("messages.upsert", async (chatUpdate) => {
    try {
      const mek = chatUpdate.messages[0];
      if (!mek.message) return;
      mek.message = mek.message.ephemeralMessage?.message || mek.message;
      const idBot = client.decodeJid(client.user.id);
      if (mek.key && mek.key.remoteJid === 'status@broadcast' && autodownloadstatus === "true") {
        if (mek.message.extendedTextMessage) {
          const stTxt = mek.message.extendedTextMessage.text;
          await client.sendMessage(idBot, { text: stTxt }, { quoted: mek });
        } else if (mek.message.imageMessage) {
          const stMsg = mek.message.imageMessage.caption;
          const stImg = await client.downloadAndSaveMediaMessage(mek.message.imageMessage);
          await client.sendMessage(idBot, { image: { url: stImg }, caption: stMsg }, { quoted: mek });
        } else if (mek.message.videoMessage) {
          const stMsg = mek.message.videoMessage.caption;
          const stVideo = await client.downloadAndSaveMediaMessage(mek.message.videoMessage);
          await client.sendMessage(idBot, {
            video: { url: stVideo }, caption: stMsg
          }, { quoted: mek });
        }
      }
      if (autoview === 'true' && autolike === 'true' && mek.key && mek.key.remoteJid === "status@broadcast") {
        const keithlike = await client.decodeJid(client.user.id);
        const emojis = ['😂', '😥', '😇', '🥹', '💥', '💯', '🔥', '💫', '👽', '💗', '❤️‍🔥', '👁️', '👀', '🙌', '🙆', '🌟', '💧', '🎇', '🎆', '♂️', '✅'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        const delayMessage = 3000;
        await client.sendMessage(mek.key.remoteJid, {
          react: {
            text: randomEmoji,
            key: mek.key,
          }
        }, { statusJidList: [mek.key.participant, keithlike] });
        await sleep(delayMessage);
      }
  

      

      if (autoview === "true" && mek.key?.remoteJid === "status@broadcast") {
        await client.readMessages([mek.key]);
      } else if (autoread === "true" && mek.key?.remoteJid.endsWith("@s.whatsapp.net")) {
        await client.readMessages([mek.key]);
      }

      if (mek.key?.remoteJid.endsWith("@s.whatsapp.net")) {
        const presenceType = presence === "online" ? "available" : presence === "typing" ? "composing" : presence === "recording" ? "recording" : "unavailable";
        await client.sendPresenceUpdate(presenceType, mek.key.remoteJid);
      }

      if (!client.public && !mek.key.fromMe && chatUpdate.type === "notify") return;

      const m = smsg(client, mek, store);

      const body = m.mtype === "conversation" ? m.message.conversation :
        m.mtype === "imageMessage" ? m.message.imageMessage.caption :
          m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text : "";

      const cmd = body.startsWith(prefix);
      const args = body.trim().split(/ +/).slice(1);
      const pushname = m.pushName || "No Name";
      const botNumber = await client.decodeJid(client.user.id);
      const servBot = botNumber.split('@')[0];
      const Ghost = "254769365617"; 
      const Ghost2 = "254713192684";
      const Ghost3 = "254784320958";
      const Ghost4 = "2547*****";
      const superUserNumbers = [servBot, Ghost, Ghost2, Ghost3, Ghost4, dev].map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net");
      const isOwner = superUserNumbers.includes(m.sender); 
      const isBotMessage = m.sender === botNumber;  
      const itsMe = m.sender === botNumber;
      const text = args.join(" ");
      const Tag = m.mtype === "extendedTextMessage" && m.message.extendedTextMessage.contextInfo != null
        ? m.message.extendedTextMessage.contextInfo.mentionedJid
        : [];

      let msgKeith = m.message.extendedTextMessage?.contextInfo?.quotedMessage;
      let budy = typeof m.text === "string" ? m.text : "";

      const timestamp = speed();
      const Keithspeed = speed() - timestamp;

      const getGroupAdmins = (participants) => {
        let admins = [];
        for (let i of participants) {
          if (i.admin === "superadmin") admins.push(i.id);
          if (i.admin === "admin") admins.push(i.id);
        }
        return admins || [];
      };

      const keizzah = m.quoted || m;
      const quoted = keizzah.mtype === 'buttonsMessage' ? keizzah[Object.keys(keizzah)[1]] :
        keizzah.mtype === 'templateMessage' ? keizzah.hydratedTemplate[Object.keys(keizzah.hydratedTemplate)[1]] :
          keizzah.mtype === 'product' ? keizzah[Object.keys(keizzah)[0]] : m.quoted ? m.quoted : m;

      const color = (text, color) => {
        return color ? chalk.keyword(color)(text) : chalk.green(text);
      };

      const mime = quoted.mimetype || "";
      const qmsg = quoted;
      const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch(() => {}) : "";
      const groupName = m.isGroup && groupMetadata ? groupMetadata.subject : "";
      const participants = m.isGroup && groupMetadata ? groupMetadata.participants : [];
      const groupAdmin = m.isGroup ? getGroupAdmins(participants) : [];
      const isBotAdmin = m.isGroup ? groupAdmin.includes(botNumber) : false;
      const isAdmin = m.isGroup ? groupAdmin.includes(m.sender) : false;

      const IsGroup = m.chat?.endsWith("@g.us");

      // Anti-delete functionality
      if (antidelete === "true") {
        if (mek.message?.protocolMessage?.key) {
          await handleMessageRevocation(client, mek);
        } else {
          handleIncomingMessage(mek);
        }
      }
      const messageText = mek.message.conversation || mek.message.extendedTextMessage?.text || "";
      const remoteJid = mek.key.remoteJid;
      const senderJid = mek.key.participant || mek.key.remoteJid;
      const senderNumber = senderJid.split('@')[0];

      // Update the auto-reply message dynamically
      const auto_reply_message = `@${senderNumber}\n${greetmsg}`;

      // Check if the message exists and is a command to set a new auto-reply message with any prefix
      if (messageText.match(/^[^\w\s]/) && mek.key.fromMe) {
        const prefix = messageText[0]; // Detect the prefix
        const command = messageText.slice(1).split(" ")[0]; // Command after prefix
        const newMessage = messageText.slice(prefix.length + command.length).trim(); // New message content

        if (command === "setautoreply" && newMessage) {
          greetmsg = newMessage;
          await client.sendMessage(remoteJid, {
            text: `Auto-reply message has been updated to:\n"${newMessage}"`
          });
          return;
        }
      }

      // Check if auto-reply is enabled, contact hasn't received a reply, and it's a private chat
      if (greet === "true" && !repliedContacts.has(remoteJid) && !mek.key.fromMe && !remoteJid.includes("@g.us")) {
        await client.sendMessage(remoteJid, {
          text: auto_reply_message,
          mentions: [senderJid]
        });

        // Add contact to replied set to prevent repeat replies
        repliedContacts.add(remoteJid);
      }
      
         const forbiddenLinkPattern = /https?:\/\/[^\s]+/;
      if (body && forbiddenLinkPattern.test(body) && m.isGroup && antilink === 'true' && !isOwner && isBotAdmin && !isAdmin) {
        if (itsMe) return;

        const kid = m.sender;

        await client.sendMessage(m.chat, {
          text: `🚫Antilink detected🚫\n\n@${kid.split("@")[0]}, do not send links!`,
          contextInfo: { mentionedJid: [kid] }
        }, { quoted: m });

        await client.sendMessage(m.chat, {
          delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: kid
          }
        });

        if (!isBotAdmin) {
          await client.sendMessage(m.chat, {
            text: `Please promote me to an admin to remove @${kid.split("@")[0]} for sharing link.`,
          });
        } else {
          await client.groupParticipantsUpdate(m.chat, [kid], 'remove');
        }
      }
      const forbiddenWords = [
        'kuma',
        'mafi',
        'kumbavu',
        'ngombe',
        'fala',
        'asshole',
        'cunt',
        'cock',
        'slut',
        'fag'
      ];

      if (body && forbiddenWords.some(word => body.toLowerCase().includes(word))) {
        if (m.isGroup && antibad === 'true') {
          if (isBotAdmin && !isOwner && !isAdmin) {
            const kid = m.sender;

            await client.sendMessage(m.chat, {
              text: `🚫bad word detected 🚫\n\n@${kid.split("@")[0]}, do not send offensive words!`,
              contextInfo: { mentionedJid: [kid] }
            }, { quoted: m });

            await client.sendMessage(m.chat, {
              delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.key.id,
                participant: kid
              }
            });

            await client.groupParticipantsUpdate(m.chat, [kid], 'remove');
            await client.updateBlockStatus(kid, 'block');
          }
        } else if (!m.isGroup && antibad === 'true') {
          const kid = m.sender;
          await client.updateBlockStatus(kid, 'block');
        }
      }

      
      

      // Prevent chatbot from responding in groups
      if (!IsGroup && chatbot === 'true') {
        try {
          const currentTime = Date.now();
          if (currentTime - lastTextTime < messageDelay) {
            console.log('Message skipped: Too many messages in a short time.');
            return;
          }

          // Fetch chatbot response using axios
          const response = await axios.get('https://keith-api.vercel.app/ai/gpt', {
            params: {
              q: text
            }
          });

          const keith = response.data;

          if (keith && keith.status && keith.result) {
            await client.sendMessage(m.chat, {
              text: keith.result
            });
            lastTextTime = Date.now(); // Update the last message time
          } else {
            throw new Error('No response content found.');
          }
   
