import {HttpStatusCode, Message, Response, ErrorEnum} from "./Message";

class MissingTokenErrorMsg implements Message{
    getResponse(): Response {
        return {
            status: HttpStatusCode.CREATED,
            message: "Bad Request - Request header undefined: missing JWT Token"
        }
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

class DefaultError implements Message {
    getResponse(): Response {
      return {
        message: "Ops, something went wrong",
        status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      };
    }
  }

export class ErrorFactory {
    constructor() {}
    getError(type: ErrorEnum): Message {
      let error: Message | null = null;
      switch (type) {
        case ErrorEnum.MissingTokenErrorMsg:
            error = new MissingTokenErrorMsg();
            break;
        case ErrorEnum.EmailNotValidAddress:
            error = new EmailNotValidAddress();
            break;
        default:
            error = new DefaultError();
        }
    return error;
    }
}