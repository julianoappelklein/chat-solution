import { Request, Response } from "express";
import { Schema } from "joi";

export const jsonResponse = (
  res: Response,
  data: any,
  options?: { statusCode: number }
) => {
  let opts = Object.assign({}, { statusCode: 200 }, options);
  res.status(opts.statusCode);
  res.setHeader("Content-Type", "application/json");
  res.write(data != null ? JSON.stringify(data) : "null");
  res.end();
};

export const validateRequestBodyData = (
  req: Request,
  res: Response,
  schema: Schema
) => {
  const result = schema.validate(req.body, {});
  if (result.error) {
    res.status(422).json({
      status: "error",
      message: "Invalid request data",
      data: req.body,
    });
    return false;
  }
  return true;
};
