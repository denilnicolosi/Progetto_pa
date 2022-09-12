import {HttpStatusCode, Message, Response, ErrorEnum} from "./Message";

class LoginError implements Message{
    getResponse(): Response {
        return {
            status: HttpStatusCode.UNAUTHORIZED,
            message: "Unauthorized - Login Failed"
        }
    }
}

class CreateMatchError implements Message{
  getResponse(): Response {
      return {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: "Internal Error on create match"
      }
  }
}

class MoveError implements Message{
  getResponse(): Response {
      return {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: "Internal Error on move"
      }
  }
}

class MoveNotAllowedError implements Message{
  getResponse(): Response {
      return {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: "Move not allowed in this position"
      }
  }
}

class PlayedMatchError implements Message{
  getResponse(): Response {
      return {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: "Internal Error on get played match"
      }
  }
}


class StatusMatchError implements Message{
  getResponse(): Response {
      return {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: "Internal Error on get status match"
      }
  }
}

class HistoryMovesError implements Message{
  getResponse(): Response {
      return {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: "Internal Error on get history moves"
      }
  }
}

class PlayerRankError implements Message{
  getResponse(): Response {
      return {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: "Internal Error on get player rank"
      }
  }
}

class TokenGetError implements Message{
  getResponse(): Response {
      return {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: "Internal Error on get token residual"
      }
  }
}

class TokenChargeError implements Message{
  getResponse(): Response {
      return {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: "Internal Error on charge token"
      }
  }
}

class EndMatchError implements Message{
  getResponse(): Response {
      return {
          status: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: "Internal Error on end match"
      }
  }
}

class DefaultError implements Message {
  getResponse(): Response {
      return {
        message: "Ops, something went wrong",
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      };
    }
  }


class EmailNotValidAddress implements Message{
  getResponse(): Response {
      return {
          status: HttpStatusCode.BAD_REQUEST,
          message: "Bad Request - Request body undefined: invalid email address"
      }
  }
}

class LoginBadRequest implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.BAD_REQUEST,
      message: "Bad Request - Request field: ... "
    }
  }
}

class CreateMatchBadRequest implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.BAD_REQUEST,
      message: "Bad Request - Request field: ... "
    }
  }
}

class MoveBadRequest implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.BAD_REQUEST,
      message: "Bad Request - Request field: ... "
    }
  }
}

class PlayedMatchBadRequest implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.BAD_REQUEST,
      message: "Bad Request - Request field: ... "
    }
  }
}

class StatusMatchBadRequest implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.BAD_REQUEST,
      message: "Bad Request - Request field: ... "
    }
  }
}

class HistoryMovesBadRequest implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.BAD_REQUEST,
      message: "Bad Request - Request field: ... "
    }
  }
}

class PlayerRankBadRequest implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.BAD_REQUEST,
      message: "Bad Request - Request field: ... "
    }
  }
}

class TokenGetBadRequest implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.BAD_REQUEST,
      message: "Bad Request - Request field: ... "
    }
  }
}

class TokenChargeBadRequest implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.BAD_REQUEST,
      message: "Bad Request - Request field: ... "
    }
  }
}

class EndMatchBadRequest implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.BAD_REQUEST,
      message: "Bad Request - Request field: ... "
    }
  }
}

class CreateMatchNotAllowed implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: "This player has a match already open."
    }
  }
}

class RouteNotFound implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.NOT_FOUND,
      message: "Route not found"
    }
  }
}

class JwtNotValid implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.UNAUTHORIZED,
      message: "Unauthorized - JWT not valid"
    }
  }
}

class ForbiddenRole implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.FORBIDDEN,
      message: "Forbidden - The user does not have the required role"
    }
  }
}

class NotEnoughToken implements Message{
  getResponse(): Response {
    return {
      status: HttpStatusCode.UNAUTHORIZED,
      message: "Unauthorized - The player does not have enough tokens"
    }
  }
}






export class ErrorFactory {
    constructor() {}

    getError(type: ErrorEnum): Message {

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
        case ErrorEnum.StatusMatchBadRequest:
          errorClass = new StatusMatchBadRequest();
          break;
        case ErrorEnum.HistoryMovesBadRequest:
          errorClass = new HistoryMovesBadRequest();
          break;
        case ErrorEnum.PlayerRankBadRequest:
          errorClass = new PlayerRankBadRequest();
          break;
        case ErrorEnum.TokenGetBadRequest:
          errorClass = new TokenGetBadRequest();
          break;
        case ErrorEnum.TokenChargeBadRequest:
          errorClass = new TokenChargeBadRequest();
          break;
        case ErrorEnum.EndMatchBadRequest:
          errorClass = new EndMatchBadRequest();
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
          
        default:
          errorClass = new DefaultError();
        }
    return errorClass;
    }
}