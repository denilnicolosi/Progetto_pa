import {HttpStatusCode, Message, Response, ErrEnum} from "./Message";

class MissingTokenErrorMsg implements Message{
    getResponse(): Response {
        return {
            status: HttpStatusCode.CREATED,
            message: "Bad Request - Request header undefined: missing JWT Token"
        }
    }
}

class InternalError implements Message {
    getResponse(): Response {
      return {
        message: "Ops, something went wrong",
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      };
    }
  }

export class ErrorFactory {
    constructor() {}
    getError(type: ErrEnum): Message {
      let error: Message | null = null;
      switch (type) {
        case ErrEnum.MissingTokenErrorMsg:
            error = new MissingTokenErrorMsg();
            break;
        default:
            error = new InternalError();
        }
    return error;
    }
}