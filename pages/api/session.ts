import fetch from 'isomorphic-unfetch';
import auth0 from '../../lib/auth0';
import { NextApiRequest, NextApiResponse } from 'next'

export default async(req: NextApiRequest, res: NextApiResponse) => {
  try {
    const tokenCache = auth0.tokenCache(req, res);
    const { accessToken } = await tokenCache.getAccessToken();
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error('AUTH0 SESSION ERROR: ', error);
    res.status(error.status || 500).json({
      code: error.code,
      error: error.message
    });
  }
}