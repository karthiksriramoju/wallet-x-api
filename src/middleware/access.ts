import { Request, Response, NextFunction } from "express";

export const access = (req: Request, res: Response, next: NextFunction) => {
  console.log("Headers:", req.headers); // Debug headers
  console.log("Raw Body:", req.body); // Debug request body    
  const { API_TOKEN } = req.body;
  
  if (API_TOKEN !== process.env.API_TOKEN) {
      console.log("Invalid API_TOKEN received:", API_TOKEN);
      res.status(401).json({ error: "Unauthorized server request." });
      return;
  }
  next()
};