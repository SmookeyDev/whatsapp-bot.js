const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios  = require('axios');
const fs = require('fs');

const FILE_PATH = './modules/session.json';
let sessionFile;
if (fs.existsSync(FILE_PATH)) {
    sessionFile = require(FILE_PATH);
}

const client = new Client({
    session: sessionFile
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true})
});

client.on('ready', () => {
    console.log("Client is ready!")
});

client.on('authenticated', (session) => {
    sessionData = session;
    fs.writeFile('./modules/session.json', JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});

client.on('message', async msg => {
    let chat = await msg.getChat();
    console.log(`Mensagem recebida: ${msg.body} (Chat: ${chat.name})`);

    if (msg.body.startsWith('!msg ')){
        request = await axios.get(`http://0.0.0.0:8080/api?msg=${msg.body.split(' ')[1]}`)
        data = request.data
        if (data.process == false){
            msg.reply('Ocorreu um erro ao processar essa mensagem.')
        }
        else{
            msg.reply(`${data.message}`)
        }
    }
    // Utilits

    else if (msg.body === '!info'){
        let info = client.info;
        msg.reply(`*Informações do Bot*
Nome: ${info.pushname}
Meu número: ${info.me.user}
Dispositivo: ${info.platform}
Versão do WhatsApp: ${info.phone.wa_version}`);
    }

    else if (msg.body === '!groupinfo'){
        if (chat.isGroup) {
            msg.reply(`*Detalhes do Grupo*
Nome: ${chat.name}
Descrição: ${chat.description}
Criado em: ${chat.createdAt.toString()}
Criado por: ${chat.owner.user}
Número de participantes: ${chat.participants.length}`);
        }
        else{
            msg.reply('Esse comando só pode ser usado em grupos.')
        }
    }

    else if (msg.body === '!memberlist'){
        if (chat.isGroup){
            var memberlist = '*Usuários do Grupo*'
            for (i in chat.participants){
                var data = chat.participants[i]
                var admin;
                if (data.isAdmin == true){admin = "Sim"}
                else {admin = "Não"}
                memberlist += `\n${i} - @${data.id.user} (Admin: ${admin})`
            }
            msg.reply(memberlist)
        }
        else{
            msg.reply('Esse comando só pode ser usado em grupos.')
        }
    }

    else if (msg.body === '!groups'){
        const chats = await client.getChats();
        var grouplist = '*Grupos*'
        var count = 0;
        for (i in chats){
            if (chats[i].isGroup == true){
                grouplist += `\n${count} - ${chats[i].name}`
                count += 1; 
            }
        }
        msg.reply(grouplist)
    }

    // Group Management

    else if (msg.body.startsWith('!desc ')){
        if (chat.isGroup) {
            try{
                let newDescription = msg.body.slice(6);
                chat.setDescription(newDescription);
            }
            catch(e){
                msg.reply('Erro ao definir a nova descrição.')
            }

        } 
        else {
            msg.reply('Esse comando só pode ser usado em grupos.');
        }
    }

    // Sudo

    else if (msg.body.startsWith('!join ')){
        const inviteCode = msg.body.split(' ')[1];
        console.log(inviteCode)
        try {
            await client.acceptInvite(inviteCode);
            msg.reply('Entrei no grupo!');
        } catch (e) {
            console.log(e)
            msg.reply('Aparentemente esse convite é invalido.');
        }
    }

});

client.initialize();