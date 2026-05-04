# Analysis & Requirements Document

## 1. Project Overview
A production-quality full-stack e-commerce SaaS mobile application built with React Native and Supabase. The app features a minimalist Black & White design, real-time product management, and a mock payment gateway for demonstration purposes.

## 2. Identified Pain Points
* **Complexity in Setup**: Small businesses often struggle with complex e-commerce configurations.
* **Lack of Mobile-First Admin Tools**: Many SaaS platforms have poor mobile experiences for shop owners to manage products on the go.
* **Security & Trust**: Users need clear feedback on order status and secure authentication.

## 3. Real-World Scenarios
* **Scenario A: The Quick Seller**: A boutique owner takes a photo of a new product and lists it via the mobile Admin Panel in under 60 seconds.
* **Scenario B: The On-the-Go Customer**: A user browses products during their commute, adds items to their cart, and completes a mock checkout to see how the system handles orders.
* **Scenario C: Order Management**: An administrator receives an order, updates the status to "Ongoing" while packing, and "Delivered" once shipped, providing real-time feedback to the user.

## 4. Functional Requirements
* **Authentication**: Secure email/password login and signup via Supabase.
* **Product Catalog**: Dynamic fetching of products with category filtering.
* **Cart Management**: Add/remove items and calculate totals locally.
* **Mock Checkout**: Simulation of a credit card payment flow with validation.
* **Order Tracking**: Users can view their recent order history and statuses.
* **Admin Panel**: Role-based access (RBAC) to add products and manage all customer orders.

## 5. Non-Functional Requirements
* **Aesthetics**: High-contrast, premium Black & White SaaS UI.
* **Performance**: Fast loading with Activity Indicators and optimized Supabase queries.
* **Security**: Row Level Security (RLS) policies at the database level to protect user data.
* **Scalability**: Modular code structure allowing for future integration of real payment APIs (e.g., Stripe).

## 6. User Stories
* **As a User**, I want to filter products by category so I can find what I need quickly.
* **As a Customer**, I want to see my order status so I know when my items will arrive.
* **As an Admin**, I want to add new products with an image preview so I can verify the look before publishing.
