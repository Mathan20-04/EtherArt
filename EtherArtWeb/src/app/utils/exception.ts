export class EtherBaseExcetion extends Error {
  public message;
  public errorCode;
  public errorObject;

  constructor(message, errorCode, errorObject) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.errorObject = errorObject;
  }
}

export class HttpException extends EtherBaseExcetion {
  constructor(message, errorCode, errorObject) {
    super(message, errorCode, errorObject);
  }
}

export class GeneralException extends EtherBaseExcetion {
  constructor(message, errorCode, errorObject) {
    super(message, errorCode, errorObject);
  }
}

export class EmptyResponseException extends EtherBaseExcetion {
  constructor(message, errorCode, errorObject) {
    super(message, errorCode, errorObject);
  }
}
