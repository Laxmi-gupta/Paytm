import type { Response } from "express";

export class Send {
  static success(res:Response,data: any,message: string = "success") {
    return res.status(200).json({
      ok: true,
      data,
      message
    })
  }

  static error(res:Response,data:any,message: string = "error") {
    return res.status(400).json({
      ok: false,
      data,
      message
    })
  }

  static notFound(res:Response,data: any,message:string ="Not found") {
    return res.status(404).json({
      ok: false,
      data,
      message
    })
  }

   static unAuthorized(res:Response,data: any,message:string = "Unauthorized") {
    return res.status(401).json({
      ok: false,
      data,
      message
    })
  }
}

