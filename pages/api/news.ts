import { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import apicache from 'apicache'
import subDays from 'date-fns/subDays'

let cache = apicache.middleware('30 minutes')

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, result => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default async (req: Request, res: Response) => {
  await runMiddleware(req, res, cache)

  const { country } = req.query;

  console.log('Making News API call')
  const { data } = await axios.get('https://newsapi.org/v2/top-headlines', {
    params: {
      q: 'coronavirus',
      sortBy: 'publishedAt',
      from: subDays(new Date, 7).toISOString().split('T')[0],
      apiKey: process.env.NEWS_API_KEY,
      pageSize: 100,
      page: 1,
      country
    }
  })
  res.status(200).json(data.articles);
};