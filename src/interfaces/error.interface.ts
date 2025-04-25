 // src/interfaces/error.interface.ts
 export interface IHttpException extends Error {
    status: number;
    message: string;
  }