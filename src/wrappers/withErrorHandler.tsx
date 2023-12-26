import { NextApiHandler } from 'next';

import ApiError from '@/class/ApiError';

import { checkIsHTTPMethod } from '@/util/api.util';

import HTTPMethod from '@/constant/HTTPMethod';

/**
 * Next.js API Error Handler wrapper
 * @param handler The NextApiHandler route handle
 * @param method The allow method to access the route
 */
const withErrorHandler = (handler: NextApiHandler, method?: HTTPMethod | HTTPMethod[]): NextApiHandler => {
  return async (req, res) => {
    try {
      if (method) checkIsHTTPMethod(method)(req);

      await handler(req, res);
    } catch (err) {
      if (err instanceof ApiError) return res.status(err.status).json({ error: err.message });

      console.error(err);

      return res.status(500).json({ error: 'Server error.' });
    }
  };
};

export default withErrorHandler;
