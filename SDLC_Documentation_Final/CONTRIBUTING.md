# Contributing to E-Commerce Mobile Application

## 🤝 How to Contribute

We welcome contributions from the community! This document provides guidelines and best practices for contributing to the e-commerce mobile application project. Whether you're fixing bugs, adding features, improving documentation, or suggesting enhancements, your contributions are valuable.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [GitHub Best Practices](#github-best-practices)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)
- [License](#license)

---

## 🏛️ Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. We pledge to:

- **Be respectful** and considerate in all interactions
- **Accept responsibility** for mistakes and learn from them
- **Show empathy** towards other community members
- **Focus on constructive feedback** rather than criticism
- **Value diverse perspectives** and experiences

### Unacceptable Behavior

The following behaviors are considered unacceptable:

- Harassment, discrimination, or offensive comments
- Personal attacks or trolling
- Public or private harassment
- Publishing others' private information without permission
- Other conduct deemed inappropriate in a professional setting

### Reporting Violations

If you experience or witness unacceptable behavior, please report it by:

- Emailing: conduct@company.com
- Creating a private issue on GitHub with details
- Contacting a project maintainer directly

---

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js 18+** installed
- **npm or yarn** package manager
- **Expo CLI** for React Native development
- **Git** for version control
- **Supabase account** for backend services
- **iOS Simulator** or **Android Emulator** for testing

### Development Setup

#### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/Joelorbit/ecommerce-mobile-app.git
cd ecommerce-mobile-app
```

#### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install mobile app dependencies
cd ../mobile
npm install
```

#### 3. Environment Configuration

```bash
# Copy environment templates
cp backend/.env.example backend/.env
cp mobile/.env.example mobile/.env

# Configure your Supabase credentials
# Edit .env files with your development Supabase project details
```

#### 4. Database Setup

```bash
# Initialize Supabase locally (optional)
npx supabase start

# Or use cloud Supabase project
# Run migrations
npx supabase db push
```

#### 5. Start Development

```bash
# Terminal 1: Start API server
cd backend
npm run dev

# Terminal 2: Start mobile app
cd mobile
npx expo start
```

---

## 🔄 Development Workflow

### Branching Strategy

We follow a **Git Flow** branching model:

```
main (production-ready)
├── develop (integration branch)
│   ├── feature/user-authentication
│   ├── feature/product-catalog
│   ├── bugfix/login-validation
│   ├── hotfix/critical-security-patch
│   └── refactor/state-management
```

#### Branch Naming Conventions

- **Features:** `feature/description-of-feature`
- **Bug Fixes:** `bugfix/description-of-bug`
- **Hotfixes:** `hotfix/description-of-fix`
- **Refactoring:** `refactor/description-of-change`
- **Documentation:** `docs/description-of-docs`

### Commit Message Standards

We follow the **Conventional Commits** specification:

```
type(scope): description

[optional body]

[optional footer]
```

#### Commit Types

- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, etc.)
- **refactor:** Code refactoring
- **test:** Adding or updating tests
- **chore:** Maintenance tasks

#### Examples

```bash
feat(auth): add biometric login support
fix(cart): resolve duplicate item addition bug
docs(api): update authentication endpoint documentation
test(products): add unit tests for product filtering
refactor(state): migrate to Zustand for state management
```

---

## 🎯 GitHub Best Practices

### Repository Organization

#### Labels

We use standardized labels for issues and PRs:

- **bug** - Something isn't working
- **enhancement** - New feature or request
- **documentation** - Documentation improvements
- **good first issue** - Ideal for newcomers
- **help wanted** - Extra attention needed
- **priority: high** - High priority items
- **priority: low** - Low priority items
- **status: in progress** - Currently being worked on
- **status: blocked** - Blocked by dependencies

#### Projects

We organize work using GitHub Projects:

- **Sprint Backlog** - Current sprint items
- **Bug Triage** - Incoming bug reports
- **Feature Requests** - Planned enhancements
- **Documentation** - Documentation tasks

### Issue Management

#### Creating Issues

When creating issues, please:

- **Use clear, descriptive titles**
- **Provide detailed descriptions** with steps to reproduce
- **Include screenshots** for UI-related issues
- **Specify environment details** (OS, device, app version)
- **Add appropriate labels** and assignees
- **Link related issues** or pull requests

#### Issue Templates

We provide templates for:

- **Bug Reports** - Structured bug reporting
- **Feature Requests** - Feature proposal template
- **Security Issues** - Responsible disclosure template

### Pull Request Best Practices

#### PR Guidelines

- **Keep PRs focused** - One feature or fix per PR
- **Write descriptive titles** following commit conventions
- **Provide detailed descriptions** explaining the change
- **Reference related issues** using keywords (fixes #123, closes #456)
- **Include screenshots** for UI changes
- **Update documentation** if needed

#### PR Size

- **Small PRs** (< 200 lines): Quick review, low risk
- **Medium PRs** (200-500 lines): Standard review process
- **Large PRs** (> 500 lines): May require multiple reviewers

---

## 🔄 Pull Request Process

### Step-by-Step Guide

#### 1. Prepare Your Branch

```bash
# Ensure you're on develop branch
git checkout develop
git pull origin develop

# Create and switch to feature branch
git checkout -b feature/your-feature-name
```

#### 2. Make Changes

```bash
# Make your changes following coding standards
# Write tests for new functionality
# Update documentation if needed

# Stage and commit changes
git add .
git commit -m "feat: add your feature description"
```

#### 3. Push and Create PR

```bash
# Push your branch
git push origin feature/your-feature-name

# Create Pull Request on GitHub
# Use the PR template and fill in all sections
```

#### 4. Code Review Process

1. **Automated Checks** - CI/CD pipeline runs
2. **Peer Review** - Team members review code
3. **Testing** - QA validates functionality
4. **Approval** - Maintainers approve changes
5. **Merge** - Changes merged to develop branch

### Review Checklist

#### For Reviewers

- [ ] **Code Quality** - Follows coding standards
- [ ] **Functionality** - Works as expected
- [ ] **Tests** - Adequate test coverage
- [ ] **Documentation** - Updated if needed
- [ ] **Security** - No security vulnerabilities
- [ ] **Performance** - No performance regressions

#### For Contributors

- [ ] **Self-Review** - Review your own code first
- [ ] **Tests Pass** - All tests are passing
- [ ] **No Lint Errors** - Code follows style guidelines
- [ ] **Documentation Updated** - README and docs updated
- [ ] **Breaking Changes** - Documented if any

---

## 💻 Coding Standards

### JavaScript/TypeScript

#### Code Style

```javascript
// Use descriptive variable names
const userAuthenticationStatus = "authenticated";

// Prefer const over let, let over var
const API_BASE_URL = "https://api.example.com";
let currentUser = null;

// Use arrow functions for callbacks
const handleSubmit = (data) => {
  // Handle form submission
};

// Use template literals
const greeting = `Hello, ${user.name}!`;
```

#### File Organization

```
src/
├── components/          # Reusable UI components
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   └── Input/
├── screens/            # Screen components
├── services/           # API and external services
├── stores/            # State management
├── utils/             # Utility functions
├── constants/         # App constants
└── types/             # TypeScript type definitions
```

### React Native Specific

#### Component Structure

```typescript
// Use functional components with hooks
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface UserProfileProps {
  userId: string;
  onUpdate: (user: User) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId, onUpdate }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  const fetchUser = async (id: string) => {
    try {
      const userData = await userService.getUser(id);
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.email}>{user?.email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
});
```

#### State Management (Zustand)

```typescript
// store/userStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,

        login: async (credentials) => {
          const user = await authService.login(credentials);
          set({ user, isAuthenticated: true });
        },

        logout: () => {
          authService.logout();
          set({ user: null, isAuthenticated: false });
        },

        updateProfile: async (updates) => {
          const currentUser = get().user;
          if (!currentUser) throw new Error("No user logged in");

          const updatedUser = await userService.updateProfile(
            currentUser.id,
            updates,
          );
          set({ user: updatedUser });
        },
      }),
      {
        name: "user-storage",
        partialize: (state) => ({ user: state.user }),
      },
    ),
    { name: "user-store" },
  ),
);
```

### Backend (Node.js/Express)

#### API Design

```typescript
// routes/products.ts
import express from "express";
import { body, param, validationResult } from "express-validator";
import { ProductService } from "../services/ProductService";
import { authenticate, authorize } from "../middleware/auth";

const router = express.Router();
const productService = new ProductService();

// GET /api/products - Get all products
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;

    const products = await productService.getProducts({
      page: Number(page),
      limit: Number(limit),
      category: category as string,
    });

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: products.total,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// POST /api/products - Create product (Admin only)
router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  [
    body("name").trim().isLength({ min: 1 }).withMessage("Name is required"),
    body("price").isFloat({ min: 0 }).withMessage("Price must be positive"),
    body("category")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Category is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array(),
        });
      }

      const product = await productService.createProduct(req.body);

      res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },
);

export default router;
```

---

## 🧪 Testing Guidelines

### Testing Pyramid

```
E2E Tests (10%)     - User journey validation
  ↕️
Integration Tests (20%) - API and service interactions
  ↕️
Unit Tests (70%)        - Component and function testing
```

### Unit Testing (Jest + React Testing Library)

#### Component Testing

```typescript
// components/ProductCard/ProductCard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ProductCard } from './ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 29.99,
  image: 'https://example.com/image.jpg',
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeTruthy();
    expect(screen.getByText('$29.99')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    render(<ProductCard product={mockProduct} onPress={mockOnPress} />);

    const card = screen.getByTestId('product-card');
    fireEvent.press(card);

    expect(mockOnPress).toHaveBeenCalledWith(mockProduct);
  });

  it('displays image with correct source', () => {
    render(<ProductCard product={mockProduct} />);

    const image = screen.getByTestId('product-image');
    expect(image.props.source.uri).toBe(mockProduct.image);
  });
});
```

#### API Testing

```typescript
// services/__tests__/ProductService.test.ts
import { ProductService } from "../ProductService";
import { supabase } from "../../lib/supabase";

jest.mock("../../lib/supabase");

describe("ProductService", () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService();
    jest.clearAllMocks();
  });

  describe("getProducts", () => {
    it("returns products with default pagination", async () => {
      const mockProducts = [
        { id: "1", name: "Product 1" },
        { id: "2", name: "Product 2" },
      ];

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          range: jest.fn().mockResolvedValue({
            data: mockProducts,
            error: null,
          }),
        }),
      });

      const result = await productService.getProducts();

      expect(result).toEqual(mockProducts);
      expect(supabase.from).toHaveBeenCalledWith("products");
    });

    it("handles database errors", async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          range: jest.fn().mockResolvedValue({
            data: null,
            error: { message: "Database error" },
          }),
        }),
      });

      await expect(productService.getProducts()).rejects.toThrow(
        "Database error",
      );
    });
  });
});
```

### Integration Testing

```typescript
// __tests__/auth-flow.test.ts
import request from "supertest";
import app from "../app";
import { supabase } from "../lib/supabase";

describe("Authentication Flow", () => {
  beforeEach(async () => {
    // Clear test database
    await supabase.from("profiles").delete().neq("id", "");
  });

  it("completes full user registration and login flow", async () => {
    // Register user
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send({
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.success).toBe(true);

    // Login user
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.success).toBe(true);
    expect(loginResponse.body.data.token).toBeDefined();

    const token = loginResponse.body.data.token;

    // Access protected route
    const profileResponse = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.data.email).toBe("test@example.com");
  });
});
```

### E2E Testing (Detox)

```typescript
// e2e/LoginFlow.test.ts
import { device, expect, element, by } from "detox";

describe("Login Flow", () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should login successfully with valid credentials", async () => {
    // Navigate to login screen
    await element(by.id("login-button")).tap();

    // Enter credentials
    await element(by.id("email-input")).typeText("test@example.com");
    await element(by.id("password-input")).typeText("password123");

    // Submit login
    await element(by.id("submit-login")).tap();

    // Verify successful login
    await expect(element(by.id("welcome-message"))).toBeVisible();
    await expect(element(by.text("Welcome, Test User!"))).toBeVisible();
  });

  it("should show error for invalid credentials", async () => {
    await element(by.id("login-button")).tap();
    await element(by.id("email-input")).typeText("invalid@example.com");
    await element(by.id("password-input")).typeText("wrongpassword");
    await element(by.id("submit-login")).tap();

    await expect(element(by.text("Invalid credentials"))).toBeVisible();
  });
});
```

---

## 📚 Documentation

### Documentation Standards

#### README Updates

When adding new features, update the README.md with:

- Feature description and usage
- Configuration requirements
- API endpoint documentation
- Example code snippets

#### Code Documentation

````typescript
/**
 * Calculates the total price of items in the cart including tax
 * @param items - Array of cart items with price and quantity
 * @param taxRate - Tax rate as decimal (e.g., 0.08 for 8%)
 * @returns Total price including tax
 * @throws {Error} If items array is empty or tax rate is invalid
 *
 * @example
 * ```typescript
 * const items = [
 *   { price: 10.99, quantity: 2 },
 *   { price: 5.50, quantity: 1 }
 * ];
 * const total = calculateCartTotal(items, 0.08);
 * console.log(total); // 28.06
 * ```
 */
export function calculateCartTotal(
  items: Array<{ price: number; quantity: number }>,
  taxRate: number,
): number {
  if (!items.length) {
    throw new Error("Cart must contain at least one item");
  }

  if (taxRate < 0 || taxRate > 1) {
    throw new Error("Tax rate must be between 0 and 1");
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return subtotal * (1 + taxRate);
}
````

#### API Documentation

```typescript
// API endpoint documentation
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get products with optional filtering
 *     parameters:
 *       - name: category
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter products by category
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of products per page
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
```

---

## 🐛 Issue Reporting

### Bug Reports

When reporting bugs, please provide:

#### Required Information

- **Clear title** describing the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs. actual behavior
- **Environment details:**
  - OS and version
  - Device type (iOS/Android)
  - App version
  - Browser (if web-related)

#### Example Bug Report

```
**Title:** Cart total not updating after removing items

**Description:**
When removing items from the cart, the total price doesn't update correctly.

**Steps to Reproduce:**
1. Add 3 items to cart (total: $45.00)
2. Remove 1 item (total should be: $30.00)
3. Total still shows $45.00

**Expected Behavior:**
Total should recalculate when items are removed.

**Actual Behavior:**
Total remains unchanged.

**Environment:**
- iOS 15.2
- iPhone 13
- App version 1.2.3

**Additional Context:**
Issue occurs in both online and offline modes.
```

### Feature Requests

For feature requests, include:

- **Clear description** of the proposed feature
- **Use case** explaining why it's needed
- **Mockups or examples** if applicable
- **Acceptance criteria** for implementation

---

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT License). See [LICENSE.md](LICENSE.md) for details.

### Contributor License Agreement

All contributors must sign a Contributor License Agreement (CLA) before their contributions can be accepted. The CLA ensures that:

- You have the right to grant the license
- The project can relicense the contribution if needed
- Your contributions don't infringe on third-party rights

---

## 🙏 Recognition

Contributors will be recognized in:

- **GitHub Contributors** list
- **CHANGELOG.md** for significant contributions
- **Release notes** for major features
- **Project documentation** acknowledgments

### Contribution Levels

- **Code Contributor** - Code changes merged
- **Documentation Contributor** - Documentation improvements
- **Bug Reporter** - Quality bug reports with reproduction steps
- **Feature Suggester** - Well-documented feature requests
- **Reviewer** - Code review contributions

---

## 📞 Getting Help

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and discussions
- **Slack** - Real-time communication (#contributors channel)
- **Email** - maintainers@company.com for private matters

### Response Times

- **Bug Reports:** Acknowledged within 24 hours
- **Feature Requests:** Initial response within 3 days
- **Pull Request Reviews:** Within 2 business days
- **General Questions:** Within 1 business day

---

Thank you for contributing to the e-commerce mobile application! Your efforts help make this project better for everyone. 🎉
