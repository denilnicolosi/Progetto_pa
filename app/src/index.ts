import express from 'express';
import { Jwt } from 'jsonwebtoken'
import * as controllerUser from './controllers/userController';
import * as controllerMatch from './controllers/matchController';
import * as middlewareUser from './middlewares/userMiddleware';
import * as middlewareMatch from './middlewares/matchMiddleware';
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
  async function (req: any, res: any) {
    var response = await controllerUser.login(req.body.email, req.body.password, res)
    res.status(response.status).send(JSON.stringify({message: response.message, data: response.data}))
  }
);

app.post(
  "/newgame",
  [middlewareUser.checkJWT, middlewareMatch.checkChallenger],
  async function (req: any, res: any) {
    var response = await controllerMatch.newMatch(req, res)
    res.status(response.status).send(JSON.stringify({message: response.message, data: response.data}))
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



