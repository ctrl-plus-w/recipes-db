import { NextApiHandler } from "next";

import ApiError from "@/class/ApiError";

import { checkIsHTTPMethod } from "@/util/api.util";

import HTTPMethod from "@/constant/HTTPMethod";
import { ZodError } from "zod";

/**
 * Next.js API Error Handler wrapper
 * @param handler The NextApiHandler route handle
 * @param method The allow method to access the route
 */
const withErrorHandler = (
  handler: NextApiHandler,
  method?: HTTPMethod | HTTPMethod[],
): NextApiHandler => {
  return async (req, res) => {
    try {
      if (method) checkIsHTTPMethod(method)(req);

      return await handler(req, res);
    } catch (err) {
      if (err instanceof ApiError)
        return Response.json({ error: err.message }, { status: err.status });

      if (err instanceof ZodError)
        return Response.json({ error: err.message }, { status: 400 });

      return Response.json({ error: "Server error." }, { status: 500 });
    }
  };
};

export default withErrorHandler;
