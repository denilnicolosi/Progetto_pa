import express from 'express';
import { Jwt } from 'jsonwebtoken'
import * as controllerUser from './controllers/userController';
import * as middlewareUser from './middlewares/userMiddleware';
import * as dotenv from 'dotenv';

const app = express()
const port = 3000
dotenv.config();
app.use(express.json());

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})



app.get('/', (req:any, res:any) => {
  const jsChessEngine = require('js-chess-engine')
  const game = new jsChessEngine.Game()
  console.log(game.exportJson())


  res.send(game.exportJson())
})


app.post(
  "/login",
  [middlewareUser.checkInputEmail, middlewareUser.checkInputPassword],
  function (req: any, res: any) {
    controllerUser.login(req.body.email, req.body.password, res);
  }
);

app.post(
  "/newgame",
  [middlewareUser.checkJWT],
  function (req: any, res: any) {
    res.send("OK")
  }
);

app.post(
  "/move",
  [middlewareUser.checkJWT],
  function (req: any, res: any) {

  }
);

app.get(
  "/playedmatch",
  [middlewareUser.checkJWT],
  function (req: any, res: any) {

  }
);

app.get(
  "/statusmatch",
  [middlewareUser.checkJWT],
  function (req: any, res: any) {

  }
);

app.get(
  "/historymoves",
  [middlewareUser.checkJWT],
  function (req: any, res: any) {

  }
);

app.get(
  "/playersrank",
  [],
  function (req: any, res: any) {

  }
);

app.put(
  "/chargetoken",
  [middlewareUser.checkJWT],
  function (req: any, res: any) {

  }
);

app.put(
  "/endmatch",
  [middlewareUser.checkJWT],
  function (req: any, res: any) {

  }
);



/*
const jsChessEngine = require('js-chess-engine')
const game = new jsChessEngine.Game()
game.printToConsole()
game.move("A2","A3")
game.printToConsole()
game.move("A7","A6")
game.printToConsole()
console.log(game.exportJson())
console.log("--------- HISTORY ------------")
console.log(game.getHistory())*/
