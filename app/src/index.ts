import express from 'express';
import { Jwt } from 'jsonwebtoken'
import * as controllerUser from './controllers/userController';
import * as controllerMatch from './controllers/matchController';
import * as middlewareUser from './middlewares/userMiddleware';
import * as middlewareMatch from './middlewares/matchMiddleware';
import * as middlewareError from './middlewares/errorMiddleware';
import * as dotenv from 'dotenv';
import { stringify } from 'querystring';

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
  res.setHeader('Content-Type', 'application/json').send(game.exportJson())
})


app.post(
  "/login",
  [middlewareUser.checkInputEmail, middlewareUser.checkInputPassword],
  async function (req: any, res: any) {
    var response = await controllerUser.login(req.body.email, req.body.password, res)
    res.setHeader('Content-Type', 'application/json').status(response.status).send(JSON.stringify({message: response.message, data: response.data}))
  }
);

app.post(
  "/newgame",
  [middlewareUser.checkJWT,middlewareUser.checkRolePlayer, middlewareMatch.checkChallenger],
  async function (req: any, res: any) {
    var response = await controllerMatch.newMatch(req, res)
    res.setHeader('Content-Type', 'application/json').status(response.status).send(JSON.stringify({message: response.message, data: response.data}))
  }
);


app.post(
  "/move",
  [middlewareUser.checkJWT, middlewareUser.checkRolePlayer, middlewareMatch.checkAILevel, middlewareMatch.checkMoves],
  async function (req: any, res: any) {
    var response = await controllerMatch.move(req, res)
    res.setHeader('Content-Type', 'application/json').status(response.status).send(JSON.stringify({message: response.message, data: response.data}))
  }
);

app.get(
  "/playedmatch",
  [middlewareUser.checkJWT, middlewareUser.checkRolePlayer, middlewareMatch.checkDate],
  async function (req: any, res: any) {
    var response = await controllerMatch.playedMatch(req, res)
    res.setHeader('Content-Type', 'application/json').status(response.status).send(JSON.stringify({message: response.message, data: response.data}))
  }
);

app.get(
  "/statusmatch",
  [middlewareUser.checkJWT, middlewareUser.checkRolePlayer, middlewareMatch.checkMatchId],
  async function (req: any, res: any) {
    var response = await controllerMatch.statusMatch(req, res)
    res.setHeader('Content-Type', 'application/json').status(response.status).send(JSON.stringify({message: response.message, data: response.data}))
  }
);

app.get(
  "/historymoves",
  [middlewareUser.checkJWT, middlewareMatch.checkMatchId, middlewareUser.checkRolePlayer],
  async function (req: any, res: any) {
    var response = await controllerMatch.historyMoves(req, res)
    res.setHeader('Content-Type', 'application/json').status(response.status).send(JSON.stringify({message: response.message, data: response.data}))
  }
);

app.get(
  "/playersrank",
  [],
  async function (req: any, res: any) {
    var response = await controllerMatch.playersRank(req, res)
    res.setHeader('Content-Type', 'application/json').status(response.status).send(JSON.stringify({message: response.message, data: response.data}))
  }
);

app.get(
  "/token",
  [middlewareUser.checkJWT, middlewareUser.checkRolePlayer],
  async function (req: any, res: any) {
    var response = await controllerUser.getToken(req)
    res.status(response.status).send(JSON.stringify({message: response.message, data: response.data}))
  }
);

app.put(
  "/token",
  [middlewareUser.checkJWT, middlewareUser.checkRoleAdmin, middlewareUser.checkInputEmail, middlewareUser.checkInputToken],
  async function (req: any, res: any) {
    var response = await controllerUser.chargeToken(req.body.email, req.body.token, res)
    res.setHeader('Content-Type', 'application/json').status(response.status).send(JSON.stringify({message: response.message, data: response.data}))
  }
);

app.put(
  "/endmatch",
  [middlewareUser.checkJWT, middlewareUser.checkRolePlayer],
  function (req: any, res: any) {

  }
);

//tutte le altre richieste (da tutti i metodi) che non sono quelle implementate sopra, ritornano errore 404 not found
app.all('*', middlewareError.errorRouteNotFound)

//gestione di un error handler nella chain del middleware
app.use(middlewareError.errorHandler)

