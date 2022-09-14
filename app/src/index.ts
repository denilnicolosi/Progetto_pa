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

// enable express application on https server
const app = express()
const port = 3000
dotenv.config();
app.use(express.json());

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`App listening on port ${port}`)
});

//login route
app.post(
  "/login",
  [middlewareUser.checkInputEmail, middlewareUser.checkInputPassword], 
  async function (req: any, res: any) {
    var response = await controllerUser.login(req.body.email, req.body.password, res)
    res.setHeader('Content-Type', response.type).status(response.status).send(JSON.stringify({message: response.message, data: response.data}))
  }
);

//new game route
app.post(
  "/newgame",
  [middlewareUser.checkJWT,middlewareUser.checkRolePlayer, middlewareMatch.checkChallenger],
  async function (req: any, res: any) {
    var response = await controllerMatch.newMatch(req, res)
    res.setHeader('Content-Type', response.type).status(response.status).send(JSON.stringify({message: response.message, data: response.data}))
  }
);

//move route
app.post(
  "/move",
  [middlewareUser.checkJWT, middlewareUser.checkRolePlayer, middlewareMatch.checkMoves],
  async function (req: any, res: any) {
    var response = await controllerMatch.move(req, res)
    res.setHeader('Content-Type', response.type).status(response.status).send(JSON.stringify({message: response.message, data: response.data}))
  }
);

//played match route
app.get(
  "/playedmatch",
  [middlewareUser.checkJWT, middlewareUser.checkRolePlayer, middlewareMatch.checkDate],
  async function (req: any, res: any) {
    var response = await controllerMatch.playedMatch(req, res)
    res.setHeader('Content-Type', response.type).status(response.status).send(JSON.stringify({message: response.message, data: response.data}))
  }
);

//status match route
app.get(
  "/statusmatch",
  [middlewareUser.checkJWT, middlewareUser.checkRolePlayer, middlewareMatch.checkMatchId],
  async function (req: any, res: any) {
    var response = await controllerMatch.statusMatch(req, res)
    res.setHeader('Content-Type', response.type).status(response.status).send(JSON.stringify({message: response.message, data: response.data}))
  }
);

//history moves route
app.get(
  "/historymoves",
  [middlewareUser.checkJWT,  middlewareUser.checkRolePlayer, middlewareMatch.checkMatchId, middlewareMatch.checkExportType],
  async function (req: any, res: any) {
    var response = await controllerMatch.historyMoves(req, res)
    res.setHeader('Content-Type', response.type).status(response.status).send(JSON.stringify({message: response.message, data: response.data}))
  }
);

//players rank route
app.get(
  "/playersrank",
  [middlewareMatch.checkOrder],
  async function (req: any, res: any) {
    var response = await controllerMatch.playersRank(req, res)
    res.setHeader('Content-Type', response.type).status(response.status).send(JSON.stringify({message: response.message, data: response.data}))
  }
);

// get token route
app.get(
  "/token",
  [middlewareUser.checkJWT, middlewareUser.checkRolePlayer],
  async function (req: any, res: any) {
    var response = await controllerUser.getToken(req)
    res.setHeader('Content-Type', response.type).status(response.status).send(JSON.stringify({message: response.message, data: response.data}))
  }
);

// update token route
app.put(
  "/token",
  [middlewareUser.checkJWT, middlewareUser.checkRoleAdmin, middlewareUser.checkInputEmail, middlewareUser.checkInputToken],
  async function (req: any, res: any) {
    var response = await controllerUser.chargeToken(req.body.email, req.body.token, res)
    res.setHeader('Content-Type', response.type).status(response.status).send(JSON.stringify({message: response.message, data: response.data}))
  }
);

//end match route
app.put(
  "/endmatch",
  [middlewareUser.checkJWT, middlewareUser.checkRolePlayer],
  async function (req: any, res: any) {
    var response = await controllerMatch.endMatch(req, res)
    res.setHeader('Content-Type', response.type).status(response.status).send(JSON.stringify({message: response.message, data: response.data}))
  }
);

//all other requests (from all methods) that are not the ones implemented above return 404 not found error
app.all('*', middlewareError.errorRouteNotFound)

//management of an error handler in the middleware chain
app.use(middlewareError.errorHandler)

