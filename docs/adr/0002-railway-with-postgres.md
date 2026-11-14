# Ledger runs on Railway with a Postgres database

The starting code runs on ChatGPT Sites as a Cloudflare Workers app with a D1 database and R2 file storage. The owner chose Railway as the home for the public product. The database therefore becomes Postgres and uploaded files move to Railway's bucket storage; none of the Sites-specific or Cloudflare-specific plumbing carries over.

## Considered Options

Staying on ChatGPT Sites was ruled out by the research in `docs/research/chatgpt-sites-as-product-host.md`: its sign-in needs a ChatGPT account, there is no supported way to export the data, and it is a beta OpenAI may switch off. Moving the same code to Cloudflare directly would have changed the least code, and was not chosen.
