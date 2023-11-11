# GetTix

### Overview

- Users can list a ticket for an event (concert, sports) for sale
-  Other users can purchase this tickets
- Any user can list tickets for sale and purchase tickets
- When a user attempts to purchase a ticket, the ticket is locked for 15 minutes. The user has 15 minutes to enter their payment info.
- While locked, no other user can purchase the ticket. After 15 minutes, the ticket should unlock
- Ticket prices can be edited if they are not locked

### Services

- Auth - Everything related to user signup/signin/signout
- Tickets - Ticket creation/editing. Knows whether a ticket can be updated
- Orders - Order creating/editing
- Expiration - Watches for orders to be created, cancels them after 15 min
- Payments - Handles credit card payments. Cancels orders if payments fails, completes if payment succeeds   