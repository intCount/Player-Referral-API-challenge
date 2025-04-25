// src/utils/error.handler.ts
  import { IHttpException } from '../interfaces/error.interface';
  
  export class HttpException implements IHttpException {
    public status: number;
    public message: string;
    
    constructor(status: number, message: string) {
      this.status = status;
      this.message = message;
    }
  }
  
  export class BadRequestException extends HttpException {
    constructor(message: string = 'Bad request') {
      super(400, message);
    }
  }
  
  export class UnauthorizedException extends HttpException {
    constructor(message: string = 'Unauthorized') {
      super(401, message);
    }
  }
  
  export class NotFoundException extends HttpException {
    constructor(message: string = 'Not found') {
      super(404, message);
    }
  }
  
  export class ConflictException extends HttpException {
    constructor(message: string = 'Conflict') {
      super(409, message);
    }
  }
  
  export class InternalServerErrorException extends HttpException {
    constructor(message: string = 'Internal server error') {
      super(500, message);
    }
  }