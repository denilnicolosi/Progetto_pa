import {HttpStatusCode, Message, Response, SuccessEnum} from "./Message";

class JWTSuccess implements Message {
    getResponse(): Response {
      return {
        message: "User created with success",
        status: 201,
      };
    }
  }

class DefaultSuccess implements Message {
    getResponse(): Response {
        return {
        message: "Good results",
        status: 200,
        };
}
}

export class SuccessFactory {
    constructor() {}
    getSuccess(type: SuccessEnum): Message {
      let success: Message | null = null;
      switch (type) {
        case SuccessEnum.JWTSuccess:
          success = new JWTSuccess();
          break;
        default:
          success = new DefaultSuccess();
    }
    return success;
  }
}