import express from 'express';
import * as dotenv from 'dotenv';
import * as controllerUser from './controllers/userController';
import * as controllerMatch from './controllers/matchController';
import * as middlewareUser from './middlewares/userMiddleware';
import * as middlewareMatch from './middlewares/matchMiddleware';
import * as middlewareError from './middlewares/errorMiddleware';
import {readFileSync} from 'fs';

//manage https
var https = require('https');
var certificate = readFileSync('/home/node/app/certs/selfsigned.crt', 'utf8');
var privateKey  = readFileSync('/home/node/app/certs/selfsigned.key', 'utf8');
var credentials = {key: privateKey, cert: certificate};


const app = express()
const port = 3000
dotenv.config();
app.use(express.json());

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`App listening on port ${port}`)
});

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
  [middlewareUser.checkJWT, middlewareUser.checkRolePlayer, middlewareMatch.checkMoves],
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
  [middlewareUser.checkJWT,  middlewareUser.checkRolePlayer, middlewareMatch.checkMatchId, middlewareMatch.checkExportType],
  async function (req: any, res: any) {
    var response = await controllerMatch.historyMoves(req, res)
    res.setHeader('Content-Type', 'application/json').status(response.status).send(JSON.stringify({message: response.message, data: response.data}))
  }
);

app.get(
  "/playersrank",
  [middlewareMatch.checkOrder],
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
    res.setHeader('Content-Type', 'application/json').status(response.status).send(JSON.stringify({message: response.message, data: response.data}))
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
  async function (req: any, res: any) {
    var response = await controllerMatch.endMatch(req, res)
    console.log(response)
    res.setHeader('Content-Type', 'application/json').status(response.status).send(JSON.stringify({message: response.message, data: response.data}))
  }
);

//tutte le altre richieste (da tutti i metodi) che non sono quelle implementate sopra, ritornano errore 404 not found
app.all('*', middlewareError.errorRouteNotFound)

//gestione di un error handler nella chain del middleware
app.use(middlewareError.errorHandler)

