module.exports = async (client, m, gcpresence) => {
    if (m.isGroup && gcpresence === 'true') {
        let Jinwiilrecordin = ['recording', 'composing'];
        let Jinwiilrecordinfinal = Jinwiilrecordin[Math.floor(Math.random() * Junwiilrecordin.length)];
        await client.sendPresenceUpdate(Jinwiilrecordinfinal, m.chat);
    }
};
