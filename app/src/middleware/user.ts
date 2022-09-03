/**
 * Check if the input body contains valid email
 * @param req user request
 * @param res response
 * @param next next middleware
 */
 export const checkInputEmail = function (req: any, res: any, next: any) {
    try {
      //checking if email is valid
      if (
        typeof req.body.email !== "string"     
      ) {
        var error = "errore";
        next(error);
      } else next();
    } catch (error: any) {
      var error= "errore"
      next(error);
    }
  };


/**
 * Check if the input body contains valid password
 * @param req user request
 * @param res response
 * @param next next middleware
 */
 export const checkInputPassword = function (req: any, res: any, next: any) {
    try {
      //checking if password is valid
      if (
        typeof req.body.password !== "string" ||
        req.body.password.length > 50
      ) {
        var error = "errore"
        next(error);
      } else next();
    } catch (error: any) {
      var error= "errore"
      next(error);
    }
  };