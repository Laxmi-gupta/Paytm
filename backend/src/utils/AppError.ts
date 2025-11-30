export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message:string,statusCode:number) {
    super(message);
    this.statusCode=statusCode;
    this.isOperational=true;

    (Error as any).captureStackTrace(this,this.constructor)
  }
}

throw BadError(400,"dfhjgjdf")

function BadError(arg0: number, arg1: string) {
  throw new Error("Function not implemented.");
}
