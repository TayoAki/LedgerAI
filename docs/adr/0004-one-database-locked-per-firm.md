# One database, with every record locked to its Firm

A Firm must never see another Firm's Clients. The choice was between a separate database for every Firm and one shared database in which every record carries its Firm. The owner chose the shared database, because a new Firm can then sign up instantly and running cost does not grow with every signup.

## Consequences

The separation has to be enforced by the database itself, so that a query made for one Firm cannot return another Firm's rows even if application code forgets to filter.
