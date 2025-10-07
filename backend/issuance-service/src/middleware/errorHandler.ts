import { Request, Response, NextFunction } from "express";

export class ErrorHandler {
  static handleError(err: Error, req: Request, res: Response, next: NextFunction): void {
    console.error("Unhandled error:", {
      error: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    });

    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }

  static handleNotFound(req: Request, res: Response): void {
    res.status(404).json({ 
      success: false, 
      message: "Route not found" 
    });
  }
}
