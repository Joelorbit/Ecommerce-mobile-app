# Design Documents

## 1. System Architecture

The application follows a modern decoupled architecture using a mobile frontend and a backend-as-a-service (BaaS).

```mermaid
graph TD
    User((User))
    Admin((Admin))

    subgraph "Mobile App (React Native/Expo)"
        UI[SaaS B&W Interface]
        State[Zustand State Management]
        Router[Expo Router File-based]
    end

    subgraph "Supabase Platform"
        Auth[Supabase Auth]
        DB[(PostgreSQL DB)]
        RLS[Row Level Security]
        Storage[Image Storage Proxy]
    end

    User --> UI
    Admin --> UI
    UI --> State
    State --> Router
    Router --> Auth
    Router --> DB
    DB -.-> RLS
```

## 2. Database Schema (ERD)

The database is structured to support role-based access and order tracking.

```mermaid
erDiagram
    PROFILES ||--o{ ORDERS : "places"
    PROFILES {
        uuid id PK
        string email
        string full_name
        string role "user | admin"
    }
    PRODUCTS ||--o{ ORDERS : "included in"
    PRODUCTS {
        bigint id PK
        string name
        decimal price
        string category
        string image
    }
    ORDERS {
        uuid id PK
        uuid user_id FK
        jsonb items "array of products"
        decimal total_price
        string status "open | ongoing | delivered"
        timestamp created_at
    }
```

## 3. UI/UX Philosophy

- **Minimalism**: Focus on product imagery and clear typography.
- **Contrast**: Using #000 and #FFF to create a premium SaaS feel.
- **Feedback**: Micro-animations for loading states and instant success feedback for transactions.

## 4. API Design

While the app communicates directly with Supabase via the `supabase-js` SDK, it follows a RESTful pattern for resource access:

- `GET /products`: Fetch products (filtered by RLS).
- `POST /orders`: Secure insert for authenticated users.
- `PATCH /orders/:id`: Status updates restricted to Admin role.
