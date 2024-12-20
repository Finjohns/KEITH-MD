module.exports = async (context) => {
  const { client, m } = context;

  // Sound file URLs
  const audioFiles = [
    'https://files.catbox.moe/hpwsi2.mp3',
    'https://files.catbox.moe/xci982.mp3',
    'https://files.catbox.moe/utbujd.mp3',
    'https://files.catbox.moe/w2j17k.m4a',
    'https://files.catbox.moe/851skv.m4a',
    'https://files.catbox.moe/qnhtbu.m4a',
    'https://files.catbox.moe/lb0x7w.mp3',
    'https://files.catbox.moe/efmcxm.mp3',
    'https://files.catbox.moe/gco5bq.mp3',
    'https://files.catbox.moe/26oeeh.mp3',
    'https://files.catbox.moe/a1sh4u.mp3',
    'https://files.catbox.moe/vuuvwn.m4a',
    'https://files.catbox.moe/wx8q6h.mp3',
    'https://files.catbox.moe/uj8fps.m4a',
    'https://files.catbox.moe/dc88bx.m4a',
    'https://files.catbox.moe/tn32z0.m4a'
  ];

  // Randomly pick an audio file
  const vn = audioFiles[Math.floor(Math.random() * audioFiles.length)];

  // Other variables
  const name = m.pushName || client.getName(m.sender);
  const url = 'https://github.com/Keithkeizzah/KEITH-MD2';
  const murl = 'https://whatsapp.com/channel/0029VafrbsKG8l5EFBDDCy41';
  const img = 'https://files.catbox.moe/myx5g1.jpg';

  // Constructing the contact message
  const con = {
    key: {
      fromMe: false,
      participant: `${m.sender.split('@')[0]}@s.whatsapp.net`,
      ...(m.chat ? { remoteJid: '254769365617@s.whatsapp.net' } : {}),
    },
    message: {
      contactMessage: {
        displayName: name,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
      },
    },
  };

  // Audio file message with external ad reply info
  const doc = {
    audio: {
      url: vn,
    },
    mimetype: 'audio/mpeg',
    ptt: true,
    waveform: [100, 0, 100, 0, 100, 0, 100],
    fileName: 'shizo',
    contextInfo: {
      mentionedJid: [m.sender],
      externalAdReply: {
        title: '𝗜 𝗔𝗠 𝗔𝗟𝗜𝗩𝗘 𝗠𝗢𝗧𝗛𝗘𝗥𝗙𝗨𝗖𝗞𝗘𝗥',
        body: 'Regards  𝐉𝚰𝚴𝐖𝚰𝚰𝐋𝚯𝚴𝐆𝚰𝚴𝐉𝚯🕸️',
        thumbnailUrl: img,
        sourceUrl: murl,
        mediaType: 1,
        renderLargerThumbnail: true,
      },
    },
  };

  // Send the message
  await client.sendMessage(m.chat, doc, { quoted: con });
};
