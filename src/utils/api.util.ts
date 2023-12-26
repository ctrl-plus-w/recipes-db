import type { NextApiRequest } from 'next';

import { MethodsNotAllowedError } from '@/class/ApiError';

import HTTPMethod from '@/constant/HTTPMethod';

/**
 * Check if the passed NextApiHandler has been run with one / the allowed method(s)
 * @param methodOrMethods The methods to check the handler against
 * @throws A CustomError with status 403 if the method isn't allowed
 */
export const checkIsHTTPMethod = (methodOrMethods: HTTPMethod | HTTPMethod[]) => (req: NextApiRequest) => {
  const methods = Array.isArray(methodOrMethods) ? methodOrMethods : [methodOrMethods];
  if (!req.method || !methods.some((method) => method === req.method)) throw new MethodsNotAllowedError(methods);
};

export const checkIsDELETE = checkIsHTTPMethod(HTTPMethod.DELETE);
export const checkIsPATCH = checkIsHTTPMethod(HTTPMethod.PATCH);
export const checkIsPOST = checkIsHTTPMethod(HTTPMethod.POST);
export const checkIsGET = checkIsHTTPMethod(HTTPMethod.GET);
export const checkIsPUT = checkIsHTTPMethod(HTTPMethod.PUT);
