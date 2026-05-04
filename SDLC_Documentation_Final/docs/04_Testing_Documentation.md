# Testing Documentation

---

## 1. Testing Strategy & Framework

### Comprehensive Testing Approach

The e-commerce application implements a multi-layered testing strategy to ensure quality, reliability, and user satisfaction across all components of the system.

### Testing Pyramid Structure

```
End-to-End Tests (E2E)
    ↕️ Integration Tests
        ↕️ Unit Tests
           ↕️ Static Analysis
```

#### Testing Types Overview

| Testing Type          | Scope                              | Tools                       | Frequency            |
| --------------------- | ---------------------------------- | --------------------------- | -------------------- |
| **Unit Tests**        | Individual functions/components    | Jest, React Testing Library | Every commit (CI/CD) |
| **Integration Tests** | Component interactions             | Jest, Supertest             | Pull requests        |
| **End-to-End Tests**  | Complete user workflows            | Detox, Maestro              | Daily/nightly        |
| **Performance Tests** | System load and responsiveness     | Lighthouse, Custom scripts  | Weekly               |
| **Security Tests**    | Authentication and data protection | OWASP ZAP, Manual review    | Monthly              |

---

## 2. Unit Testing Implementation

### Mobile Application Unit Tests

#### Component Testing Setup

##### Button Component Test (components/ui/Button.test.tsx)

<div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 10px 0;">

```typescript
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('renders with correct title', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} />
    );

    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByText } = render(
      <Button title="Press Me" onPress={mockOnPress} />
    );

    fireEvent.press(getByText('Press Me'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading state correctly', () => {
    const { getByTestId } = render(
      <Button
        title="Loading Button"
        onPress={mockOnPress}
        loading={true}
      />
    );

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('is disabled when loading', () => {
    const { getByText } = render(
      <Button
        title="Disabled Button"
        onPress={mockOnPress}
        loading={true}
      />
    );

    const button = getByText('Disabled Button');
    fireEvent.press(button);
    expect(mockOnPress).not.toHaveBeenCalled();
  });
});
```

</div>

#### Custom Hook Testing

##### Authentication Hook Test (hooks/useAuth.test.ts)

<div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin: 10px 0;">

```typescript
import { renderHook, act } from "@testing-library/react-hooks";
import { useAuth } from "./useAuth";
import { supabase } from "../services/supabase";

// Mock Supabase
jest.mock("../services/supabase");

describe("useAuth Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with null user", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });

  it("handles successful sign in", async () => {
    const mockUser = { id: "123", email: "test@example.com" };
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn("test@example.com", "password");
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoading).toBe(false);
  });

  it("handles sign in error", async () => {
    const mockError = { message: "Invalid credentials" };
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: null,
      error: mockError,
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      try {
        await result.current.signIn("test@example.com", "wrongpassword");
      } catch (error) {
        expect(error).toEqual(mockError);
      }
    });

    expect(result.current.user).toBeNull();
  });
});
```

</div>

#### State Management Testing

##### Cart Store Test (store/cartStore.test.ts)

<div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 10px 0;">

```typescript
import { act, renderHook } from "@testing-library/react-hooks";
import { useCartStore } from "./cartStore";

describe("Cart Store", () => {
  beforeEach(() => {
    const { result } = renderHook(() => useCartStore());
    act(() => {
      result.current.clearCart();
    });
  });

  it("starts with empty cart", () => {
    const { result } = renderHook(() => useCartStore());

    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
  });

  it("adds item to cart", () => {
    const { result } = renderHook(() => useCartStore());
    const testItem = {
      productId: 1,
      name: "Test Product",
      price: 29.99,
      quantity: 1,
      image: "test.jpg",
    };

    act(() => {
      result.current.addItem(testItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual(testItem);
    expect(result.current.total).toBe(29.99);
  });

  it("updates item quantity", () => {
    const { result } = renderHook(() => useCartStore());
    const testItem = {
      productId: 1,
      name: "Test Product",
      price: 29.99,
      quantity: 1,
      image: "test.jpg",
    };

    act(() => {
      result.current.addItem(testItem);
      result.current.updateQuantity(1, 3);
    });

    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.total).toBe(89.97);
  });

  it("removes item from cart", () => {
    const { result } = renderHook(() => useCartStore());
    const testItem = {
      productId: 1,
      name: "Test Product",
      price: 29.99,
      quantity: 1,
      image: "test.jpg",
    };

    act(() => {
      result.current.addItem(testItem);
      result.current.removeItem(1);
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
  });
});
```

</div>

### Backend API Unit Tests

#### API Route Testing

##### Authentication Routes Test (routes/auth.test.js)

<div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 10px 0;">

```javascript
const request = require("supertest");
const express = require("express");
const authRoutes = require("./auth");
const supabase = require("../supabase");

// Mock Supabase
jest.mock("../supabase");

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

describe("Authentication Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /auth/register", () => {
    it("should register a new user successfully", async () => {
      const mockUser = {
        id: "123",
        email: "test@example.com",
        full_name: "Test User",
      };

      supabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      supabase.from.mockReturnValue({
        insert: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
      });

      const response = await request(app).post("/auth/register").send({
        email: "test@example.com",
        password: "Password123!",
        fullName: "Test User",
      });

      expect(response.status).toBe(201);
      expect(response.body.user).toEqual(mockUser);
    });

    it("should return 400 for invalid email", async () => {
      const response = await request(app).post("/auth/register").send({
        email: "invalid-email",
        password: "Password123!",
        fullName: "Test User",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("email");
    });

    it("should return 400 for weak password", async () => {
      const response = await request(app).post("/auth/register").send({
        email: "test@example.com",
        password: "weak",
        fullName: "Test User",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("password");
    });
  });

  describe("POST /auth/login", () => {
    it("should login user successfully", async () => {
      const mockUser = { id: "123", email: "test@example.com" };
      const mockSession = { access_token: "token", refresh_token: "refresh" };

      supabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const response = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "Password123!",
      });

      expect(response.status).toBe(200);
      expect(response.body.user).toEqual(mockUser);
      expect(response.body.session).toEqual(mockSession);
    });

    it("should return 401 for invalid credentials", async () => {
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: "Invalid credentials" },
      });

      const response = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain("Invalid credentials");
    });
  });
});
```

</div>

#### Middleware Testing

##### Authentication Middleware Test (middleware/auth.test.js)

<div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 10px 0;">

```javascript
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./auth");
const supabase = require("../supabase");

jest.mock("../supabase");

describe("Authentication Middleware", () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it("should call next for valid token", async () => {
    const userId = "123";
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);

    mockReq.headers.authorization = `Bearer ${token}`;

    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { id: userId, role: "user" },
            error: null,
          }),
        }),
      }),
    });

    await authenticateToken(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.user).toEqual({ id: userId, role: "user" });
  });

  it("should return 401 for missing token", async () => {
    await authenticateToken(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Access token required",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 403 for invalid token", async () => {
    mockReq.headers.authorization = "Bearer invalid-token";

    await authenticateToken(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid token" });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
```

</div>

---

## 3. Integration Testing

### API Integration Tests

#### End-to-End API Workflow Test

<div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 10px 0;">

```javascript
const request = require("supertest");
const app = require("../index");
const supabase = require("../supabase");

jest.mock("../supabase");

describe("E-commerce API Integration", () => {
  let authToken;
  let testUser;
  let testProduct;

  beforeAll(async () => {
    // Setup test data
    testUser = { id: "123", email: "test@example.com" };
    testProduct = {
      id: 1,
      name: "Test Product",
      price: 29.99,
      category: "Electronics",
    };

    // Mock Supabase responses
    supabase.auth.signUp.mockResolvedValue({
      data: { user: testUser },
      error: null,
    });

    supabase.from.mockImplementation((table) => {
      if (table === "profiles") {
        return {
          insert: jest.fn().mockResolvedValue({ data: testUser, error: null }),
        };
      }
      if (table === "products") {
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              single: jest.fn().mockResolvedValue({
                data: testProduct,
                error: null,
              }),
            }),
          }),
        };
      }
    });
  });

  it("should complete full user registration and login flow", async () => {
    // Register user
    const registerResponse = await request(app).post("/auth/register").send({
      email: "test@example.com",
      password: "Password123!",
      fullName: "Test User",
    });

    expect(registerResponse.status).toBe(201);

    // Login user
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: {
        user: testUser,
        session: { access_token: "test-token", refresh_token: "refresh-token" },
      },
      error: null,
    });

    const loginResponse = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "Password123!",
    });

    expect(loginResponse.status).toBe(200);
    authToken = loginResponse.body.session.access_token;
  });

  it("should allow authenticated user to view products", async () => {
    const response = await request(app)
      .get("/products")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.products)).toBe(true);
  });

  it("should allow authenticated user to create order", async () => {
    supabase.from.mockReturnValue({
      insert: jest.fn().mockResolvedValue({
        data: { id: "order-123", status: "confirmed" },
        error: null,
      }),
    });

    const response = await request(app)
      .post("/orders")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        items: [
          {
            productId: 1,
            quantity: 2,
          },
        ],
        shippingAddress: {
          street: "123 Test St",
          city: "Test City",
          state: "TS",
          zipCode: "12345",
          country: "USA",
        },
      });

    expect(response.status).toBe(201);
    expect(response.body.order.id).toBe("order-123");
  });
});
```

</div>

### Mobile App Integration Tests

#### Navigation Flow Test

<div style="background: #f8d7da; padding: 15px; border-radius: 8px; margin: 10px 0;">

```typescript
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import App from '../App';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate
  })
}));

describe('App Navigation Flow', () => {
  it('should navigate from product list to product detail', async () => {
    const { getByText, getAllByText } = render(
      <NavigationContainer>
        <App />
      </NavigationContainer>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(getByText('Electronics')).toBeTruthy();
    });

    // Tap on first product
    const productCards = getAllByText(/Product/);
    fireEvent.press(productCards[0]);

    // Should navigate to product detail
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('ProductDetail', {
        productId: expect.any(Number)
      });
    });
  });

  it('should add product to cart and navigate to cart', async () => {
    // Mock cart store
    const mockAddItem = jest.fn();
    jest.mock('../store/cartStore', () => ({
      useCartStore: () => ({
        addItem: mockAddItem,
        items: [],
        total: 0
      })
    }));

    const { getByText } = render(
      <NavigationContainer>
        <App />
      </NavigationContainer>
    );

    // Navigate to product detail (assuming we're there)
    await waitFor(() => {
      expect(getByText('Add to Cart')).toBeTruthy();
    });

    // Add to cart
    fireEvent.press(getByText('Add to Cart'));

    // Should add item to cart
    expect(mockAddItem).toHaveBeenCalled();

    // Navigate to cart
    fireEvent.press(getByText('View Cart'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Cart');
    });
  });
});
```

</div>

---

## 4. End-to-End Testing

### Mobile E2E Test Scenarios

#### Complete Purchase Flow Test

<div style="background: #e1f5fe; padding: 15px; border-radius: 8px; margin: 10px 0;">

**Test Case: TC-E2E-001 - Complete Purchase Flow**

**Objective:** Verify that a user can complete a full purchase from registration to order confirmation.

**Preconditions:**

- Clean app installation
- Valid test account credentials
- Test products available in database
- Payment service configured for testing

**Test Steps:**

1. **Launch Application**
   - Open the app on device/emulator
   - Verify splash screen displays
   - App should load to welcome screen

2. **User Registration**
   - Tap "Sign Up" button
   - Enter valid email and password
   - Complete registration form
   - Verify email confirmation (mocked in test environment)
   - Should redirect to home screen

3. **Browse Products**
   - Navigate to product catalog
   - Verify products load and display correctly
   - Apply category filter
   - Verify filtered results

4. **Product Selection**
   - Tap on a product card
   - Verify product detail screen loads
   - Check product information accuracy
   - Add product to cart

5. **Cart Management**
   - Navigate to cart screen
   - Verify cart item displays correctly
   - Modify quantity
   - Verify total calculation

6. **Checkout Process**
   - Tap "Checkout" button
   - Enter shipping information
   - Select payment method
   - Review order summary
   - Submit order

7. **Order Confirmation**
   - Verify order confirmation screen
   - Check order details accuracy
   - Verify order appears in order history

**Expected Results:**

- All steps complete successfully
- No crashes or error states
- Data persists correctly
- UI remains responsive throughout

**Test Data:**

```json
{
  "user": {
    "email": "testuser@example.com",
    "password": "TestPass123!",
    "fullName": "Test User"
  },
  "product": {
    "id": 1,
    "name": "Wireless Headphones",
    "price": 149.99
  },
  "shipping": {
    "street": "123 Test Street",
    "city": "Test City",
    "state": "CA",
    "zipCode": "12345"
  }
}
```

</div>

#### Admin Management Flow Test

<div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 10px 0;">

**Test Case: TC-E2E-002 - Admin Product Management**

**Objective:** Verify admin users can manage products through the mobile interface.

**Preconditions:**

- Admin user account exists
- Admin has necessary permissions
- Product management features enabled

**Test Steps:**

1. **Admin Login**
   - Launch app as admin user
   - Enter admin credentials
   - Verify admin dashboard loads

2. **Access Product Management**
   - Navigate to admin section
   - Tap "Manage Products"
   - Verify product list displays

3. **Add New Product**
   - Tap "Add Product" button
   - Fill product information form
   - Upload product image
   - Save product

4. **Edit Existing Product**
   - Select product from list
   - Modify product details
   - Update product image
   - Save changes

5. **Delete Product**
   - Select product to delete
   - Confirm deletion
   - Verify product removed from list

6. **Verify Customer View**
   - Switch to customer account
   - Verify product changes reflect in catalog

**Expected Results:**

- All CRUD operations work correctly
- Changes sync across admin/customer views
- Image upload and display functions properly
- No data corruption or loss

</div>

### E2E Test Automation

#### Detox Configuration

<div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 10px 0;">

**e2e/config.json:**

```json
{
  "testRunner": "jest",
  "runnerConfig": "e2e/config.js",
  "skipLegacyWorkersInjection": true,
  "apps": {
    "ios": {
      "type": "ios.app",
      "binaryPath": "ios/build/Build/Products/Debug-iphonesimulator/ECommerceApp.app",
      "build": "xcodebuild -workspace ios/ECommerceApp.xcworkspace -scheme ECommerceApp -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build"
    },
    "android": {
      "type": "android.apk",
      "binaryPath": "android/app/build/outputs/apk/debug/app-debug.apk",
      "build": "cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug"
    }
  },
  "devices": {
    "simulator": {
      "type": "ios.simulator",
      "device": {
        "type": "iPhone 14"
      }
    },
    "emulator": {
      "type": "android.emulator",
      "device": {
        "avdName": "Pixel_5_API_33"
      }
    }
  },
  "configurations": {
    "ios": {
      "device": "simulator",
      "app": "ios"
    },
    "android": {
      "device": "emulator",
      "app": "android"
    }
  }
}
```

**Sample E2E Test:**

```typescript
describe("Purchase Flow", () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should complete purchase successfully", async () => {
    // Navigate to login
    await element(by.id("login-button")).tap();

    // Enter credentials
    await element(by.id("email-input")).typeText("test@example.com");
    await element(by.id("password-input")).typeText("password123");
    await element(by.id("submit-login")).tap();

    // Wait for home screen
    await expect(element(by.id("product-catalog"))).toBeVisible();

    // Add product to cart
    await element(by.id("product-1")).tap();
    await element(by.id("add-to-cart")).tap();

    // Navigate to cart
    await element(by.id("cart-tab")).tap();
    await expect(element(by.id("cart-item-1"))).toBeVisible();

    // Proceed to checkout
    await element(by.id("checkout-button")).tap();

    // Fill shipping info
    await element(by.id("street-input")).typeText("123 Main St");
    await element(by.id("city-input")).typeText("Anytown");
    await element(by.id("checkout-submit")).tap();

    // Verify success
    await expect(element(by.id("order-confirmation"))).toBeVisible();
  });
});
```

</div>

---

## 5. Performance Testing

### Mobile App Performance Tests

#### Lighthouse Performance Audit

<div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 10px 0;">

**Performance Metrics Targets:**

| Metric                       | Target  | Current | Status  |
| ---------------------------- | ------- | ------- | ------- |
| **First Contentful Paint**   | < 1.5s  | 1.2s    | ✅ Pass |
| **Largest Contentful Paint** | < 2.5s  | 2.1s    | ✅ Pass |
| **First Input Delay**        | < 100ms | 45ms    | ✅ Pass |
| **Cumulative Layout Shift**  | < 0.1   | 0.05    | ✅ Pass |
| **Bundle Size**              | < 5MB   | 3.8MB   | ✅ Pass |

**Lighthouse Configuration:**

```javascript
const lighthouse = require("lighthouse");
const chrome = require("chrome-aws-lambda");

const config = {
  extends: "lighthouse:default",
  settings: {
    formFactor: "mobile",
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2,
      disabled: false,
    },
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 1,
    },
  },
};

async function runLighthouse(url) {
  const runnerResult = await lighthouse(
    url,
    {
      logLevel: "info",
      output: "html",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    },
    config,
  );

  return runnerResult.lhr;
}
```

</div>

#### React Native Performance Monitoring

<div style="background: #e1f5fe; padding: 15px; border-radius: 8px; margin: 10px 0;">

**Performance Monitoring Setup:**

```typescript
import { PerformanceMonitor } from "react-native-performance-monitor";

// Initialize performance monitoring
PerformanceMonitor.start();

// Track component render performance
const PerformanceWrapper = ({ children }) => {
  const startTime = useRef(performance.now());

  useEffect(() => {
    const renderTime = performance.now() - startTime.current;
    if (renderTime > 16.67) {
      // More than one frame
      console.warn(`Slow render detected: ${renderTime}ms`);
    }
  });

  return children;
};

// Memory usage monitoring
const monitorMemoryUsage = () => {
  if (__DEV__) {
    // Log memory usage in development
    console.log("Memory Usage:", performance.memory);
  }
};

// Network request monitoring
const trackNetworkRequest = async (url, options) => {
  const startTime = performance.now();

  try {
    const response = await fetch(url, options);
    const duration = performance.now() - startTime;

    if (duration > 1000) {
      // Slow request
      console.warn(`Slow network request: ${url} (${duration}ms)`);
    }

    return response;
  } catch (error) {
    console.error(`Network request failed: ${url}`, error);
    throw error;
  }
};
```

</div>

### API Performance Tests

#### Load Testing with Artillery

<div style="background: #f8d7da; padding: 15px; border-radius: 8px; margin: 10px 0;">

**Load Test Configuration:**

```yaml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 10
      rampTo: 50
      name: "Ramp up load"
    - duration: 60
      arrivalRate: 50
      name: "Sustained load"
  defaults:
    headers:
      Authorization: "Bearer {{token}}"

scenarios:
  - name: "User browsing and purchasing"
    weight: 70
    flow:
      - get:
          url: "/api/products"
      - think: 2
      - get:
          url: "/api/products/{{productId}}"
      - think: 3
      - post:
          url: "/api/orders"
          json:
            items:
              - productId: "{{productId}}"
                quantity: 1
            shippingAddress:
              street: "123 Test St"
              city: "Test City"
              state: "CA"
              zipCode: "12345"
              country: "USA"

  - name: "Admin operations"
    weight: 30
    flow:
      - post:
          url: "/api/products"
          json:
            name: "Load Test Product"
            description: "Test product for load testing"
            price: 29.99
            category: "Electronics"
      - think: 1
      - put:
          url: "/api/products/{{productId}}"
          json:
            price: 39.99
```

**Performance Targets:**

| Metric                  | Target        | Acceptable   |
| ----------------------- | ------------- | ------------ |
| **Response Time (p95)** | < 500ms       | < 1000ms     |
| **Error Rate**          | < 1%          | < 5%         |
| **Throughput**          | > 100 req/sec | > 50 req/sec |
| **CPU Usage**           | < 70%         | < 85%        |
| **Memory Usage**        | < 512MB       | < 1GB        |

</div>

---

## 6. User Acceptance Testing (UAT)

### UAT Test Scenarios

#### UAT-001: New User Registration and First Purchase

<div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 15px 0;">

**Objective:** Verify complete user journey from registration to successful purchase

**Test Steps:**

1. Download and install the app
2. Complete user registration process
3. Verify email confirmation
4. Browse product catalog
5. Add items to cart
6. Complete checkout process
7. Verify order confirmation
8. Check order history

**Acceptance Criteria:**

- [ ] App installs without errors
- [ ] Registration completes successfully
- [ ] Email verification works
- [ ] Products display correctly
- [ ] Cart functionality works
- [ ] Payment processing succeeds
- [ ] Order confirmation received
- [ ] Order appears in history

**Test Data:**

- Email: `uat-user-{{timestamp}}@example.com`
- Password: `TestPass123!`
- Product: Any available product
- Payment: Test payment method

</div>

#### UAT-002: Admin Product Management

<div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 15px 0;">

**Objective:** Verify admin users can effectively manage the product catalog

**Test Steps:**

1. Login as admin user
2. Access admin dashboard
3. Add new product with image
4. Edit existing product details
5. Update product pricing
6. Remove product from catalog
7. Verify changes reflect for regular users

**Acceptance Criteria:**

- [ ] Admin login successful
- [ ] Dashboard loads correctly
- [ ] Product creation works
- [ ] Product editing functions
- [ ] Image upload succeeds
- [ ] Product deletion works
- [ ] Changes sync to customer view

**Test Data:**

- Admin credentials provided by development team
- Product data: Valid product information
- Images: Standard test images

</div>

#### UAT-003: Cross-Device Compatibility

<div style="background: #d1ecf1; padding: 20px; border-radius: 8px; margin: 15px 0;">

**Objective:** Ensure consistent experience across different devices and platforms

**Test Environment:**

- iPhone 12/13/14 (iOS 15+)
- Samsung Galaxy S21/S22 (Android 11+)
- iPad Pro (iOS 15+)
- Android Tablet (Android 11+)

**Test Steps:**

1. Install app on each device
2. Complete registration on one device
3. Login on other devices
4. Verify data synchronization
5. Test all major features
6. Check UI responsiveness

**Acceptance Criteria:**

- [ ] App installs on all devices
- [ ] Account syncs across devices
- [ ] All features work consistently
- [ ] UI adapts to different screen sizes
- [ ] Performance acceptable on all devices

</div>

### UAT Test Execution Plan

#### Test Environment Setup

<div style="background: #f3e5f5; padding: 15px; border-radius: 8px; margin: 10px 0;">

**UAT Environment Specifications:**

- **Server:** Staging environment identical to production
- **Database:** Separate UAT database with test data
- **Mobile Devices:** Physical devices for realistic testing
- **Network:** Varied network conditions (WiFi, 4G, 3G)
- **Test Data:** Realistic but non-sensitive data

**Test Data Preparation:**

```sql
-- Create UAT test users
INSERT INTO auth.users (email, encrypted_password, created_at)
VALUES
  ('uat-user1@example.com', crypt('TestPass123!', gen_salt('bf')), NOW()),
  ('uat-admin@example.com', crypt('AdminPass123!', gen_salt('bf')), NOW());

-- Create UAT products
INSERT INTO products (name, description, price, category, created_at)
VALUES
  ('UAT Test Product 1', 'Test product for UAT', 29.99, 'Electronics', NOW()),
  ('UAT Test Product 2', 'Another test product', 49.99, 'Sports', NOW());

-- Assign admin role
INSERT INTO profiles (id, email, role, created_at)
VALUES
  ((SELECT id FROM auth.users WHERE email = 'uat-admin@example.com'), 'uat-admin@example.com', 'admin', NOW());
```

</div>

#### UAT Success Criteria

<div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 10px 0;">

**Overall Success Metrics:**

- **Test Case Pass Rate:** ≥ 95%
- **Critical Path Success:** 100% (registration, purchase, admin functions)
- **Performance:** All response times within acceptable ranges
- **Compatibility:** Works on all supported devices/platforms
- **User Experience:** No blocking usability issues

**Sign-off Requirements:**

- [ ] All high-priority test cases pass
- [ ] No critical or high-severity defects remain
- [ ] Performance requirements met
- [ ] Security requirements validated
- [ ] Business stakeholders approve functionality
- [ ] Development team confirms code quality

**Defect Severity Classification:**

- **Critical:** System crashes, data loss, security breaches
- **High:** Major functionality broken, payment issues
- **Medium:** Minor functionality issues, UI inconsistencies
- **Low:** Cosmetic issues, minor annoyances

</div>

---

## 7. Test Automation & CI/CD Integration

### Continuous Integration Pipeline

#### GitHub Actions Workflow

<div style="background: #e1f5fe; padding: 15px; border-radius: 8px; margin: 10px 0;">

**.github/workflows/ci.yml:**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration

      - name: Build application
        run: npm run build

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results-${{ matrix.node-version }}
          path: |
            coverage/
            test-results/

  e2e:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18.x

      - name: Install dependencies
        run: npm ci

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload E2E results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: e2e-results
          path: e2e/test-results/

  deploy-staging:
    runs-on: ubuntu-latest
    needs: [test, e2e]
    if: github.ref == 'refs/heads/develop'

    steps:
      - name: Deploy to staging
        run: |
          echo "Deploying to staging environment"
          # Add deployment commands here

  deploy-production:
    runs-on: ubuntu-latest
    needs: [test, e2e]
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Deploy to production
        run: |
          echo "Deploying to production environment"
          # Add deployment commands here
```

</div>

#### Test Coverage Requirements

| Component             | Minimum Coverage | Target Coverage |
| --------------------- | ---------------- | --------------- |
| **Unit Tests**        | 80%              | 90%             |
| **Integration Tests** | 70%              | 85%             |
| **API Routes**        | 85%              | 95%             |
| **Components**        | 75%              | 90%             |
| **Hooks**             | 80%              | 95%             |
| **Utilities**         | 90%              | 100%            |

#### Code Quality Gates

| Metric                       | Threshold    | Action      |
| ---------------------------- | ------------ | ----------- |
| **Test Coverage**            | < 80%        | Block merge |
| **Lint Errors**              | > 0          | Block merge |
| **Security Vulnerabilities** | > 0          | Block merge |
| **Performance Regression**   | > 10% slower | Block merge |
| **Bundle Size**              | > 5MB        | Warning     |

---

_This comprehensive testing documentation ensures the e-commerce application meets high quality standards through systematic testing at all levels, from unit tests to user acceptance testing._
