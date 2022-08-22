const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const porta = 3000;
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const rota = require('./rotas/index.js');
const db = require('./db.js');

var mensagens="";

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use(express.static('views'));

app.engine('html',require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use('/',rota);

io.on('connection', (socket) => {
    console.log('Usuario conectado: '+socket.id);
    socket.on('disconnect',()=>{
      console.log('Usuario desconectado: '+socket.id);
    });
  });

io.on('connection', (socket)=>{
  socket.on('user',async (nome)=>{
    await db.insert({nome});
    let nomi = await db.find({nome:nome});
    socket.emit('chat bot message',"Você entrou no chat");
    socket.broadcast.emit('chat bot message',`${nomi.nome} Acaba de entrar no chat`);
    socket.on('disconnect',()=>{
      socket.broadcast.emit('chat bot message', `${nomi.nome} se desconetou do chat`);
    })
  });
  socket.on('chat message', async (msg,nomet)=>{
    console.log(msg);
    mensagens = msg;
    nome = nomet;
    await db.insert({mensagens,nome});
    let bola = await db.find({mensagens:msg});
    let bola2 = await db.find({nome:nomet});
    io.emit('chat message',bola.mensagens,bola2.nome);
  });
});

server.listen(porta,()=>{
    console.log("Serve ON");
});