import {HttpStatusCode, Message, Response, SuccessEnum} from "./Message";


class LoginSuccess implements Message {
  getResponse(): Response {
    return {
      message: "Login success",
      status: HttpStatusCode.OK,
    };
  }
}

class CreateMatchSuccess implements Message {
  getResponse(): Response {
    return {
      message: "Match created",
      status: HttpStatusCode.CREATED,
    };
  }
}

class MoveSuccess implements Message {
  getResponse(): Response {
    return {
      message: "Move success",
      status: HttpStatusCode.OK,
    };
  }
}

class PlayedMatchSuccess implements Message {
  getResponse(): Response {
    return {
      message: "Get played match success",
      status: HttpStatusCode.OK,
    };
  }
}

class StatusMatchSuccess implements Message {
  getResponse(): Response {
    return {
      message: "Get status match success",
      status: HttpStatusCode.OK,
    };
  }
}

class HistoryMovesSuccess implements Message {
  getResponse(): Response {
    return {
      message: "Get history moves success",
      status: HttpStatusCode.OK,
    };
  }
}

class PlayersRankSuccess implements Message {
  getResponse(): Response {
    return {
      message: "Get players rank success",
      status: HttpStatusCode.OK,
    };
  }
}

class TokenGetSuccess implements Message {
  getResponse(): Response {
    return {
      message: "Get token success",
      status: HttpStatusCode.OK,
    };
  }
}

class TokenChargeSuccess implements Message {
  getResponse(): Response {
    return {
      message: "Token charge success",
      status: HttpStatusCode.OK,
    };
  }
}

class EndMatchSuccessClose implements Message {
  getResponse(): Response {
    return {
      message: "End match success",
      status: HttpStatusCode.OK,
    };
  }
}

class EndMatchSuccessCloseRequest1 implements Message {
  getResponse(): Response {
    return {
      message: "Close request from player 1 success",
      status: HttpStatusCode.OK,
    };
  }
}

class EndMatchSuccessCloseRequest2 implements Message {
  getResponse(): Response {
    return {
      message: "Close request from player 2 success",
      status: HttpStatusCode.OK,
    };
  }
}

class DefaultSuccess implements Message {
  getResponse(): Response {
    return {
      message: "Good results",
      status: HttpStatusCode.OK,
    };
  }
}

//classe del success factory, crea i messaggi di successo
export class SuccessFactory {
    
  constructor() {}

  getSuccess(type: SuccessEnum): Message {
    
    let successClass: Message | null = null;

    switch (type) {
      case SuccessEnum.LoginSuccess:
        successClass = new LoginSuccess();
        break;
      case SuccessEnum.CreateMatchSuccess:
        successClass = new CreateMatchSuccess();
        break;
      case SuccessEnum.MoveSuccess:
        successClass = new MoveSuccess();
        break;
      case SuccessEnum.PlayedMatchSuccess:
        successClass = new PlayedMatchSuccess();
        break;  
      case SuccessEnum.StatusMatchSuccess:
        successClass = new StatusMatchSuccess();
        break; 
      case SuccessEnum.HistoryMovesSuccess:
        successClass = new HistoryMovesSuccess();
        break; 
      case SuccessEnum.PlayersRankSuccess:
        successClass = new PlayersRankSuccess();
        break; 
      case SuccessEnum.TokenGetSuccess:
        successClass = new TokenGetSuccess();
        break; 
      case SuccessEnum.TokenChargeSuccess:
        successClass = new TokenChargeSuccess();
        break; 
      case SuccessEnum.EndMatchSuccessCloseRequest1:
        successClass = new EndMatchSuccessCloseRequest1();
        break;  
      case SuccessEnum.EndMatchSuccessCloseRequest2:
        successClass = new EndMatchSuccessCloseRequest2();
        break;           
      case SuccessEnum.EndMatchSuccessClose:
        successClass = new EndMatchSuccessClose();
        break;            
      default:
        successClass = new DefaultSuccess();
    }
    return successClass;
  }
}