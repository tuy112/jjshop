const express = require("express"); // 1. express 모델 만들기

const { Server } = require("http"); // 2. http 모듈 불러오기
const socketIo = require("socket.io"); // 3. Socket 모듈 불러오기

const cookieParser = require("cookie-parser");
const goodsRouter = require("./routes/goods.js");
const usersRouter = require("./routes/users.js");
const authRouter = require("./routes/auth.js");
const connect = require("./schemas");

const app = express();
const http = Server(app); // express를 http로 감싸도록 구성
const io = socketIo(http);
const port = 3000;

connect(); // mongoose를 연결합니다.

// Socket이 접속했을 때, 해당하는 콜백 함수가 실행된다
io.on("connention", (sock) => {
  console.log("새로운 소켓이 연결되었습니다.");

  // 현재 접속한 Socket 클라이언트가 종료되었을 때..
  sock.on("disconnect", () => {
    console.log(`${sock.id}에 해당하는 사용자가 연결을 종료하였습니다.`);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("assets"));
app.use("/api", [goodsRouter, usersRouter, authRouter]);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
