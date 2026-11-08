# StockWise POS

StockWise POS is a browser-based point-of-sale and inventory management prototype for small retail businesses, developed by Group 18 for MO-IT161 Web Systems and Technology.

## Development milestones

- **Milestone 1:** HTML, CSS, and JavaScript interfaces with navigation, form validation, order interactions, inventory filters, report controls, rewards, notifications, and settings.
- **Milestone 2:** Node.js, Express.js, and EJS integration for server-side rendering and routing, plus backend-supported customer CRUD with JSON file storage.
- **Terminal Assessment:** Functional validation, documentation of test results, and correction of navigation links that bypassed the backend.

## Run locally

Install Node.js and npm, then run:

```bash
git clone https://github.com/codenameazi/WST-A3101-MO-IT161-Group-18-StockWise-POS.git
cd WST-A3101-MO-IT161-Group-18-StockWise-POS
npm ci
node server.js
```

Open **http://localhost:3000/login**. Customer management can also be accessed directly at **http://localhost:3000/rewards**. Stop the server with `Ctrl+C`.

The backend must be running for customer records to be saved and retrieved. GitHub Pages serves the legacy static frontend only; it does not run Express or EJS. Use the local Express application for backend testing.

## Features and current scope

| Area | Implemented behavior |
| --- | --- |
| Orders and checkout | Product search, cart quantities and totals, checkout summary, and simulated payment validation; cart state is handled client-side. |
| Inventory | Server-rendered sample inventory, search, stock-status filters, and product-form validation. Inventory mutations are not persistently saved. |
| Reports | Report interfaces and interactive controls using sample data; reports are not generated from persistent transaction records. |
| Customer management | Add, view, edit, and remove customers through Express, with input validation and duplicate-phone checks. Records are stored in `data/customers.json`. |
| Rewards details | Customer information display; reward-point and credit interactions are not persisted as backend transactions. |
| Notifications and settings | Notification interactions and settings-form validation; persistent preferences and secure password changes are outside the implemented scope. |
| Login | Login interface and frontend validation; secure server-side authentication and authorization are not implemented. |

## Backend customer workflow

The Add Customer form submits `POST /rewards/add`. The server validates the submitted name, phone number, and email, checks for an existing exact-match phone number, generates a customer number, and writes the record to `data/customers.json`. It then redirects to `/rewards`, which reads the stored records and renders the customer list with EJS.

Customer editing and removal also update the JSON file. Use test data when evaluating these features because submissions modify local records.

## Terminal Assessment testing

The team reports **16 functional test cases with final results of 16 passed and 0 failed**, combining earlier manual testing with customer-management verification and navigation retesting. Full scenarios, expected results, observations, and notes are in the [Functional Testing Workbook](https://docs.google.com/spreadsheets/d/1arq8dOB6riyLJR742pUmsvyo8uw5BmJj6-HQ6M3SESg/edit?usp=sharing).

| Test cases | Coverage |
| --- | --- |
| TC-01–TC-05 | Customer creation and persistence, editing, duplicate-phone rejection, search, and removal/cancellation |
| TC-06–TC-10 | Empty-order validation, product search, cart calculations, checkout summary, and payment validation |
| TC-11–TC-12 | Inventory search/filtering and form validation |
| TC-13 | Report controls using sample data |
| TC-14–TC-15 | Notification interactions and settings validation |
| TC-16 | Navigation to backend Rewards and successful customer creation |

These results apply to the documented scenarios and prototype scope. They do not establish persistent inventory updates, permanent transaction storage, live sales reports, actual payment processing, or secure authentication. The package's `npm test` command is a placeholder, not an automated test suite.

### Navigation refinement and retest

TC-16 initially failed because some links opened legacy HTML pages, bypassing backend customer management. [Commit 99a6f8a](https://github.com/codenameazi/WST-A3101-MO-IT161-Group-18-StockWise-POS/commit/99a6f8adbbd76b37ac35b3bc256ab07570d7ded6) updated navigation links to Express routes and added redirects for 12 legacy page URLs.

Local HTTP checks verified the 12 redirects, backend Rewards links on eight affected pages, and customer creation with JSON persistence. After pulling the fix, manual retesting confirmed that Orders → Rewards → Add Customer worked through the normal navigation flow. TC-16 passed on retest.

External testing, the recorded validation walkthrough, and the presentation were waived per the mentor's class announcement. Internal testing results and the implemented refinement are documented in the workbook.

## Project documents

- [Functional Testing Workbook — Terminal Assessment](https://docs.google.com/spreadsheets/d/1arq8dOB6riyLJR742pUmsvyo8uw5BmJj6-HQ6M3SESg/edit?usp=sharing)
- [Application Development Workflow Worksheet](https://docs.google.com/spreadsheets/d/139T9tFDhqqGKmXmb2BbrOinVW3Lr_XsfshegPunssws/edit?usp=sharing)
- [AI Use Statement](https://docs.google.com/document/d/1aU_-2laRrgEGKUjSwO_v7cctiR18EL7D8iVzN2u33TI/edit?usp=sharing)

## Project structure

- `server.js` — Express configuration, page routes, customer validation and JSON storage, and legacy URL redirects
- `routes/orders.js` — server-rendered Orders and Complete Order routes
- `views/` — EJS page templates and shared partials
- `data/customers.json` — persistent local customer records
- `script.js` — client-side interactions and validation
- `style.css` — shared styling
- Root HTML files — legacy Milestone 1 frontend

## Group members

- Hannah Joyce Baluyot
- Haziel Sanchez
- Mharc Azriel Barcelona
- Keon Clark de Leon

## Technologies

HTML, CSS, JavaScript, Node.js, Express.js, EJS, JSON file storage, Git, and GitHub.
