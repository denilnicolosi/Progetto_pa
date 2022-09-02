import express from 'express';
//import jwt from 'jsonwebtoken';
//import { Router } from 'express';
//import userController from './controllers/userController.ts';

const app = express()
const port = 3000

/*
const router = Router();
//const user = new userController()
//console.log(user.name)


router.post('/login', userController.login);



app.use(express.json());
*/
app.get('/', (req:any, res:any) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
/*

app.use('/user', function (req, res, next) {
  console.log('Request Type:', req.method);
  console.log('request -> ', req.body.var)
  next();
});
*/


//console.log(process.env.SECRET_KEY)


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