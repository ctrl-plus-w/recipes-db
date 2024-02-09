import withErrorHandler from '@/wrapper/withErrorHandler';

import ApiError from '@/class/ApiError';
import Api from '@/class/MarmitonApi';

export const GET = withErrorHandler(async (req) => {
  const { searchParams } = new URL(req.url ?? '');

  const url = searchParams.get('url');
  if (!url) throw new ApiError('Missing URL parameter.', 400);

  const detailedRecipe = await Api.getDetailedRecipe(url);
  return Response.json(detailedRecipe);
});
