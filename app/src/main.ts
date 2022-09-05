import express from 'express';
import { Jwt } from 'jsonwebtoken'
import * as controllerUser from './controllers/userController';
import * as middlewareUser from './middleware/user';
const app = express()
const port = 3000
app.use(express.json());

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})



app.get('/', (req:any, res:any) => {
  res.send('Hello World!')
})


app.post(
  "/login",
  [middlewareUser.checkInputEmail, middlewareUser.checkInputPassword],
  function (req: any, res: any) {
    controllerUser.login(req.body.email, req.body.password, res);
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
console.log(game.getHistory())
*/