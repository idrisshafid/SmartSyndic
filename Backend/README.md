# SGC Backend API

Backend API for **SGC (Syndic Gestion System)**.

This project manages residences, apartments, owners, reservations, charges, incidents, notifications and chatbot apartment search.

---
# Features

- Authentication with JWT
- Role management (Admin, Syndic, Owner)
- Residence management
- Apartment management
- Owner assignment
- Reservation system
- Charges and payments
- Incident management
- Notifications system
- Gemini AI chatbot apartment search
- PostgreSQL database
- Zod validation
- Security middleware

---

# Technologies

## Backend

- Node.js
- Express.js
- TypeScript

## Database

- PostgreSQL

## Security

- JWT Authentication
- Helmet
- Express Rate Limit
- Zod Validation

## AI

- Google Gemini API

---

# Prerequisites

Before installation, make sure you have:

- Node.js >= 18
- PostgreSQL >= 14
- npm

Check versions:

```bash
node -v

npm -v

psql --version