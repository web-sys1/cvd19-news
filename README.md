# CVD19 News
COVID-19 news aggregator

## Contributing
Get a Developer API key fron [News API](https://newsapi.org/).
Then, create a `.env` file in the root and create a var named `NEWS_API_KEY` and assign your News API key to it, like:

```bash
NEWS_API_KEY='your_News_API_key_here'
```

Run the development server:

```bash
npm run dev
```

The project is built with Next.js, so check:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.


## TODO
- **Add internationalization**
- **Add more countries**
- **Modularize and add unit tests**
- **Find a News API sponsor**: The developer plan from News API limits the search to 100 articles. This is not a limitation at the moment but it may be in the future. You can check the pricing details [here](https://newsapi.org/pricing).
