import {MessageFactory,HttpStatusCode, Message, Response, ErrorEnum} from "./Message";

class LoginError implements Message{
    getResponse(): Response {
        return {
            status: HttpStatusCode.UNAUTHORIZED,
            message: "Unauthorized - Login Failed",
            type: "application/json"
        }
    }
}

class CreateMatchError implements Message{
  getResponse(): Response {
      return {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: "Internal Error on create match",
          type: "application/json"
      }
  }
}

class MoveError implements Message{
  getResponse(): Response {
      return {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: "Internal Error on move",
          type: "application/json"
      }
  }
}

class MoveNotAllowedError implements Message{
  getResponse(): Response {
      return {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: "Move not allowed in this position",
          type: "application/json"
      }
  }
}

class PlayedMatchError implements Message{
  getResponse(): Response {
      return {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: "Internal Error on get played match",
          type: "application/json"
      }
  }
}


class StatusMatchError implements Message{
  getResponse(): Response {
      return {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: "Internal Error on get status match",
          type: "application/json"
      }
  }
}

class HistoryMovesError implements Message{
  getResponse(): Response {
      return {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: "Internal Error on get history moves",
          type: "application/json"
      }
  }
}

class PlayerRankError implements Message{
  getResponse(): Response {
      return {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: "Internal Error on get player rank",
          type: "application/json"
      }
  }
}

class TokenGetError implements Message{
  getResponse(): Response {
      return {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: "Internal Error on get token residual",
          type: "application/json"
      }
  }
}

class TokenChargeError implements Message{
  getResponse(): Response {
      return {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: "Internal Error on charge token",
          type: "application/json"
      }
  }
}

class EndMatchError implements Message{
  getResponse(): Response {
      return {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: "Internal Error on end match",
          type: "application/json"
      }
  }
}

class DefaultError implements Message {
  getResponse(): Response {
      return {
        message: "Ops, something went wrong",
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
        type: "application/json"
      };
    }
  }


class EmailNotValidAddress implements Message{
  getResponse(): Response {
      return {
          status: HttpStatusCode.BAD_REQUEST,
          message: "Bad Request - Request body undefined: invalid email address",
          type: "application/json"
      }
  }
}

class LoginBadRequest implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.BAD_REQUEST,
      message: "Bad Request - Request field: 'email', 'password'",
      type: "application/json"
    }
  }
}

class CreateMatchBadRequest implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.BAD_REQUEST,
      message: "Bad Request - Request field: 'vs': email of the opposing player  ",
      type: "application/json"
    }
  }
}

class MoveBadRequest implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.BAD_REQUEST,
      message: "Bad Request - Request field: 'level': AI level for the next AI move (required if the game is vs AI), 'moveFrom':starting position on the chessboard , 'moveTo':target position on the chessboard",
      type: "application/json"
    }
  }
}

class PlayedMatchBadRequest implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.BAD_REQUEST,
      message: "Bad Request - Request field: 'dateFrom': start date filter, 'dateTo': end date filter",
      type: "application/json"
    }
  }
}

class StatusMatchBadRequest implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.BAD_REQUEST,
      message: "Bad Request - Request field: 'matchId': id of the match whose status you want to get ",
      type: "application/json"
    }
  }
}

class HistoryMovesBadRequest implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.BAD_REQUEST,
      message: "Bad Request - Request field: 'matchId': id of the match whose move history you want to get, 'type': JSON or FEN",
      type: "application/json"
    }
  }
}

class PlayerRankBadRequest implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.BAD_REQUEST,
      message: "Bad Request - Request field: 'order': order of the player rank (asc or desc)",
      type: "application/json"
    }
  }
}


class TokenChargeBadRequest implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.BAD_REQUEST,
      message: "Bad Request - Request field: 'email': email of the user to whom you want to upload the tokens, 'token': new token credit ",
      type: "application/json"
    }
  }
}

class EndMatchBadRequest implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.BAD_REQUEST,
      message: "Bad Request - You must have a open match to end it ",
      type: "application/json"
    }
  }
}

class MatchIdBadRequest implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.BAD_REQUEST,
      message: "Bad Request - The match id must be a number greater than zero",
      type: "application/json"
    }
  }
}

class CreateMatchNotAllowed implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: "This player has a match already open.",
      type: "application/json"
    }
  }
}

class RouteNotFound implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.NOT_FOUND,
      message: "Route not found",
      type: "application/json"
    }
  }
}


class ForbiddenRole implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.FORBIDDEN,
      message: "Forbidden - The user does not have the required role",
      type: "application/json"
    }
  }
}

class NotEnoughToken implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.UNAUTHORIZED,
      message: "Unauthorized - The player does not have enough tokens",
      type: "application/json"
    }
  }
}

class WaitEndMatch implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.FORBIDDEN,
      message: "Forbidden - Wait that the other player confirm yout close request",
      type: "application/json"
    }
  }
}

class NotYourTurn implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.FORBIDDEN,
      message: "Forbidden - Wait the move from other player",
      type: "application/json"
    }
  }
}

class JwtNotValid implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.BAD_REQUEST,
      message: "Bad request - JWT is not valid",
      type: "application/json"
    }
  }
}



//class to factory the error response
export class ErrorFactory extends MessageFactory{
    constructor() {super()}

    getMessage(type: ErrorEnum): Message {

      let errorClass: Message | null = null;
      switch (type) {
        case ErrorEnum.LoginError:
          errorClass = new LoginError();
          break;
        case ErrorEnum.CreateMatchError:
          errorClass = new CreateMatchError();
          break;
        case ErrorEnum.MoveError:
          errorClass = new MoveError();
          break;
        case ErrorEnum.MoveNotAllowedError:
          errorClass = new MoveNotAllowedError();
          break;
        case ErrorEnum.PlayedMatchError:
          errorClass = new PlayedMatchError();
          break;
        case ErrorEnum.StatusMatchError:
          errorClass = new StatusMatchError();
          break;
        case ErrorEnum.HistoryMovesError:
          errorClass = new HistoryMovesError();
          break;
        case ErrorEnum.PlayerRankError:
          errorClass = new PlayerRankError();
          break;
        case ErrorEnum.TokenGetError:
          errorClass = new TokenGetError();
          break; 
        case ErrorEnum.TokenChargeError:
          errorClass = new TokenChargeError();
          break;   
        case ErrorEnum.EndMatchError:
          errorClass = new EndMatchError();
          break;   
        case ErrorEnum.EmailNotValidAddress:
          errorClass = new EmailNotValidAddress();
          break;
        case ErrorEnum.LoginBadRequest:
          errorClass = new LoginBadRequest();
          break;
        case ErrorEnum.CreateMatchBadRequest:
          errorClass = new CreateMatchBadRequest();
          break;
        case ErrorEnum.MoveBadRequest:
          errorClass = new MoveBadRequest();
          break;
        case ErrorEnum.PlayedMatchBadRequest:
          errorClass = new PlayedMatchBadRequest();
          break;            
        case ErrorEnum.StatusMatchBadRequest:
          errorClass = new StatusMatchBadRequest();
          break;
        case ErrorEnum.HistoryMovesBadRequest:
          errorClass = new HistoryMovesBadRequest();
          break;
        case ErrorEnum.PlayerRankBadRequest:
          errorClass = new PlayerRankBadRequest();
          break;
        case ErrorEnum.TokenChargeBadRequest:
          errorClass = new TokenChargeBadRequest();
          break;
        case ErrorEnum.EndMatchBadRequest:
          errorClass = new EndMatchBadRequest();
          break;
        case ErrorEnum.MatchIdBadRequest:
          errorClass = new MatchIdBadRequest();
          break;
        case ErrorEnum.CreateMatchNotAllowed:
          errorClass = new CreateMatchNotAllowed();
          break;
        case ErrorEnum.RouteNotFound:
          errorClass = new RouteNotFound();
          break;
        case ErrorEnum.ForbiddenRole:
          errorClass = new ForbiddenRole();
          break;
        case ErrorEnum.NotEnoughToken:
          errorClass = new NotEnoughToken();
          break;
        case ErrorEnum.WaitEndMatch:
          errorClass = new WaitEndMatch();
          break;
        case ErrorEnum.NotYourTurn:
          errorClass = new NotYourTurn();
          break;
        case ErrorEnum.JwtNotValid:
          errorClass = new JwtNotValid();
          break;
          
        default:
          errorClass = new DefaultError();
        }
    return errorClass;
    }
}