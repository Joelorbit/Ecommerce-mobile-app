# Testing Documentation

## 1. Test Strategy
Testing was focused on critical path flows: Authentication, Order Placement, and Role-Based Access Control (RBAC).

## 2. Test Cases (Derived from Scenarios)

| ID | Description | Expected Result | Status |
|----|-------------|-----------------|--------|
| TC-01 | User Login with valid credentials | Redirect to Home screen | PASSED |
| TC-02 | Add item to cart and check total | Total price updates correctly | PASSED |
| TC-03 | Mock Payment with invalid card | Show validation error | PASSED |
| TC-04 | Successful Checkout | Order saved to Supabase, Cart cleared | PASSED |
| TC-05 | Admin attempts to access Admin Panel | Tab visible, access granted | PASSED |
| TC-06 | Non-Admin attempts to access Admin Panel | Tab hidden, restricted | PASSED |

## 3. Integration Testing
* **Supabase <> Mobile**: Verified that real-time status updates in the Admin panel reflect instantly on the user's Profile screen.
* **Auth <> Database**: Verified that `handle_new_user` trigger correctly populates the `profiles` table upon signup.

## 4. User Acceptance Testing (UAT)
* **Criteria**: "Can a user buy a product without technical errors?"
* **Result**: Confirmed flow from Cart -> Checkout -> Success Alert -> Order History.
* **Feedback**: The B&W design was noted as "sleek and modern".
