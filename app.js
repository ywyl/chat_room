const app = require('express')();
const server = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

server.listen(3000, () => {
  console.log('服务启动成功');
});

// express处理静态资源，设置public为静态资源目录
app.use(require('express').static('public'));

app.get('/', function (req, res) {
  console.log(111);
  res.sendFile('/index.html');
});

const user = [];

io.on('connection', function (socket) {
  socket.on('login', function ({ userName }) {
    if (user.includes(userName)) {
      socket.emit('loginError', { msg: '登录失败' });
    } else {
      socket.userName = userName;
      user.push(userName);
      socket.emit('loginSuccess', { msg: '登录成功', userName, user });
    }

    io.emit('addUser', { userName });

    io.emit('userList', { userName, user });
  });

  socket.on('disconnect', function () {
    const index = user.indexOf(socket.userName);
    if (index > -1) {
      user.splice(index, 1);
    }

    io.emit('deleteUser', { userName: socket.userName });
    io.emit('userList', { user });
  });
});
