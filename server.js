var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app);

var socket = require('socket.io');
var io = socket(server);

var dateUtiles = require('date-utils');

var path = require('path');

var port = 5000;
var socketList = [];


/*
var mysql = require('mysql');
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'db name'
})
*/

/*con.connect(function(err){
    if(err) throw err;
    console.log('DB Connected');
})*/
 
app.get('/',function (req, res) {
  res.sendFile(__dirname+'/chat.html');
});


// 사용자 접속시 실행
io.on('connection', function(socket) {

    socketList.push(socket);
    console.log('new User Connected!');

    // 새로운 사용자 접속시 chat_history table에서 10개 조회 
    // const sql = "select * from chat_history order by id desc limit 10";
    // con.query(sql,function(err,result,fields){
    //     if(err) throw err;
    //     socket.emit('INIT',result);
    // })

    socket.on('SEND', function(msg, userName,time) {

        // DB Insert
        // const sql = "insert into chat_history(name,contents,sendDate) values(?,?,?)";
        // con.query(sql,[userName,msg,time],function(err,result,fields){
        //     if(err) throw err;
        // })

        // 접속한 사용자 화면에 표출
        socketList.forEach(function(item, i) {
            if (item != socket) {
                item.emit('SEND', msg, userName, time);
            }
        });
    });

    // 더보기 기능 호출 시 마지막으로 조회된 id값 이전 chat history를 5개 가져온다.
    // socket.on('addList',function(firstId){
        
    //     const sql = "select * from chat_history where id < ? order by id desc limit 5";
    //     con.query(sql,firstId,function(err,result,fields){
    //     if(err) throw err;
        
    //     socket.emit('addResponse',result);

    //     })
    // })
 
    // 연결 종료시
    socket.on('disconnect', function() {
        socketList.splice(socketList.indexOf(socket), 1);
    });

});

server.listen(port,function () {
    console.log('Server On!');
});

app.use(express.static(path.join(__dirname,'/')));