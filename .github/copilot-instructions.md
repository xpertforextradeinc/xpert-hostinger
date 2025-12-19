# Copilot Instructions - Order Management System

## Project Overview
This document provides Copilot with comprehensive guidelines for developing and maintaining the order management system project at Xpert Forex Trade Inc. These instructions ensure consistency, quality, and adherence to best practices across all code contributions.

---

## 1. Coding Standards

### General Principles
- **Language**: JavaScript/TypeScript (Node.js backend) and React (Frontend)
- **Formatter**: Prettier with 2-space indentation
- **Linter**: ESLint with Airbnb configuration
- **Code Quality**: Maintain minimum 80% test coverage

### JavaScript/TypeScript Standards
- Use ES6+ syntax and features
- Prefer `const` and `let` over `var`
- Use arrow functions for conciseness
- Type all function parameters and return types (TypeScript)
- Use explicit error handling with try-catch blocks
- Avoid magic numbers; use named constants
- Keep functions small and focused (max 20 lines preferred)
- Use meaningful variable names (e.g., `orderTotal` instead of `ot`)

### React Standards
- Functional components with Hooks (no class components)
- Use `useState`, `useEffect`, `useContext`, `useReducer` as needed
- Prop types validation using PropTypes or TypeScript interfaces
- Extract reusable components into separate files
- Keep component files under 300 lines
- Use meaningful component naming conventions
- Memoize expensive computations with `useMemo`
- Optimize re-renders with `React.memo` when appropriate

### Async/Await Conventions
- Always use async/await for asynchronous operations
- Avoid callback chains; use Promise chains or async/await
- Handle all promises with `.catch()` or try-catch
- Never leave unhandled promise rejections

---

## 2. File Structure

### Recommended Directory Layout
```
xpert-hostinger/
├── .github/
│   ├── copilot-instructions.md
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── deploy.yml
│   │   └── tests.yml
│   └── PULL_REQUEST_TEMPLATE.md
├── src/
│   ├── components/          # React components
│   │   ├── Order/
│   │   │   ├── OrderForm.jsx
│   │   │   ├── OrderList.jsx
│   │   │   └── OrderDetails.jsx
│   │   ├── Payment/
│   │   ├── Inventory/
│   │   └── Common/
│   │       ├── Header.jsx
│   │       ├── Footer.jsx
│   │       └── Navigation.jsx
│   ├── pages/               # Page components
│   │   ├── HomePage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── services/            # API and external services
│   │   ├── orderService.js
│   │   ├── paymentService.js
│   │   ├── authService.js
│   │   └── apiClient.js
│   ├── hooks/               # Custom React hooks
│   │   ├── useOrder.js
│   │   ├── useAuth.js
│   │   └── useFetch.js
│   ├── utils/               # Utility functions
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── store/               # State management
│   │   ├── context/
│   │   └── reducers/
│   ├── styles/              # Global styles and variables
│   │   ├── global.css
│   │   ├── variables.css
│   │   └── theme.js
│   ├── __tests__/           # Test files
│   │   ├── components/
│   │   ├── services/
│   │   ├── utils/
│   │   └── hooks/
│   ├── App.jsx
│   └── index.js
├── server/                  # Backend (if applicable)
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── server.js
│   ├── __tests__/
│   └── package.json
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── docs/                    # Documentation
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── SETUP.md
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── package.json
├── README.md
└── jest.config.js
```

---

## 3. Naming Conventions

### File Naming
- **Components**: PascalCase (e.g., `OrderForm.jsx`, `PaymentProcessor.jsx`)
- **Services**: camelCase (e.g., `orderService.js`, `paymentService.js`)
- **Utilities**: camelCase (e.g., `validators.js`, `formatters.js`)
- **Tests**: Match source file name with `.test.js` or `.spec.js` suffix
- **Styles**: kebab-case (e.g., `order-form.css`, `payment-section.css`)

### Variable/Function Naming
- **Variables**: camelCase (e.g., `orderTotal`, `isProcessing`, `customerEmail`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`, `ORDER_STATUS_PENDING`, `API_TIMEOUT`)
- **Boolean variables**: Prefix with `is`, `has`, `should`, `can` (e.g., `isLoading`, `hasError`, `shouldValidate`)
- **Functions**: camelCase, descriptive verb prefixes (e.g., `fetchOrders()`, `calculateTotal()`, `validateEmail()`)
- **Classes**: PascalCase (e.g., `OrderManager`, `PaymentProcessor`)

### React Component Props
- Use descriptive names (e.g., `onOrderSubmit` instead of `onSubmit`)
- Event handlers start with `on` (e.g., `onClick`, `onChange`, `onSuccess`)
- Props for data should be singular (e.g., `order` not `orders` for single item)

### API Endpoints
- Use RESTful conventions with lowercase kebab-case
- Examples:
  - `GET /api/orders`
  - `POST /api/orders`
  - `GET /api/orders/{id}`
  - `PUT /api/orders/{id}`
  - `DELETE /api/orders/{id}`
  - `GET /api/orders/{id}/status`

---

## 4. Key Features - Development Guidelines

### Order Management
- **Create Orders**: Support multiple items per order with quantity validation
- **Order Status Tracking**: Implement workflow states (pending, processing, shipped, delivered, cancelled)
- **Order History**: Maintain complete audit trail with timestamps
- **Bulk Operations**: Support batch order processing and updates
- Implementation file: `src/services/orderService.js`

### Payment Processing
- **Payment Gateway Integration**: Support multiple payment methods (credit card, PayPal, bank transfer)
- **Transaction Verification**: Implement webhook handlers for payment confirmations
- **Refund Handling**: Support full and partial refunds with audit logging
- **PCI Compliance**: Never store sensitive payment data; use tokenization
- Implementation file: `src/services/paymentService.js`

### Inventory Management
- **Stock Tracking**: Real-time inventory updates with reservations
- **Low Stock Alerts**: Automatic notifications when items reach threshold
- **SKU Management**: Proper product identification and categorization
- **Multi-location Support**: Track inventory across multiple warehouses
- Implementation file: `src/services/inventoryService.js`

### Authentication & Authorization
- **User Authentication**: Implement JWT-based authentication
- **Role-Based Access Control**: Support admin, staff, and customer roles
- **Session Management**: Proper token refresh and expiration handling
- **Audit Logging**: Log all authentication events
- Implementation file: `src/services/authService.js`

### Reporting & Analytics
- **Order Reports**: Daily, weekly, monthly sales summaries
- **Revenue Analytics**: Track revenue by product, customer, and time period
- **Performance Metrics**: Monitor order fulfillment times and customer satisfaction
- **Data Export**: Support CSV and PDF exports
- Implementation directory: `src/components/Reports/`

---

## 5. Testing Requirements

### Test Coverage Targets
- **Overall Coverage**: Minimum 80%
- **Critical Paths**: 100% coverage (payment, authentication, order creation)
- **UI Components**: Minimum 70% coverage
- **Business Logic**: Minimum 90% coverage

### Testing Framework
- **Unit Tests**: Jest with React Testing Library
- **Integration Tests**: Supertest for API endpoints
- **E2E Tests**: Cypress or Playwright for user flows
- **Performance Tests**: Lighthouse for frontend performance

### Testing Best Practices
1. **Unit Tests**
   - Test single functions in isolation
   - Mock external dependencies (API calls, services)
   - Test both success and error cases
   - Use descriptive test names (e.g., `should calculate order total correctly`)
   - Example path: `src/__tests__/utils/orderCalculator.test.js`

2. **Component Tests**
   - Test user interactions (clicks, form submissions)
   - Verify rendered output and state changes
   - Test with different prop combinations
   - Mock API calls and child components
   - Example path: `src/__tests__/components/OrderForm.test.jsx`

3. **Integration Tests**
   - Test API endpoints with database
   - Verify business logic workflows
   - Test error handling and edge cases
   - Example path: `server/__tests__/routes/orders.test.js`

4. **E2E Tests**
   - Test complete user workflows
   - Verify cross-browser compatibility
   - Test on different devices and screen sizes
   - Example path: `cypress/e2e/order-creation.cy.js`

### Test File Template
```javascript
describe('OrderService', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  describe('createOrder', () => {
    it('should create an order with valid data', async () => {
      // Arrange
      const orderData = { /* mock data */ };
      
      // Act
      const result = await createOrder(orderData);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBeTruthy();
    });

    it('should throw error with invalid data', async () => {
      // Arrange
      const invalidData = { /* invalid data */ };
      
      // Act & Assert
      await expect(createOrder(invalidData)).rejects.toThrow();
    });
  });
});
```

### Continuous Integration
- Run tests on all pull requests
- Fail builds if coverage drops below 80%
- Run linting and formatting checks
- Execute E2E tests on staging deployments

---

## 6. Performance Considerations

### Frontend Optimization
- Implement code splitting and lazy loading for routes
- Optimize images and assets (use WebP format, compression)
- Minimize bundle size (target < 200KB gzipped)
- Use production builds for deployment
- Implement service workers for offline support
- Cache API responses with appropriate TTLs

### Backend Optimization
- Use database indexing for frequently queried fields
- Implement query pagination (limit 20-50 items per page)
- Cache frequently accessed data (Redis for sessions, frequently accessed products)
- Optimize N+1 query problems
- Monitor database performance and query times
- Implement request rate limiting (e.g., 100 requests per minute per IP)

### Monitoring & Logging
- Log all errors with context and stack traces
- Monitor API response times and error rates
- Track key business metrics (orders created, revenue, conversion rates)
- Set up alerts for critical failures
- Implement structured logging (JSON format)

---

## 7. Security Best Practices

### Code Security
- Validate and sanitize all user inputs
- Implement CSRF protection for state-changing operations
- Use Content Security Policy (CSP) headers
- Implement CORS correctly (don't use `*` for production)
- Store sensitive data in environment variables (never in code)
- Implement rate limiting on authentication endpoints

### Data Protection
- Encrypt sensitive data at rest and in transit (HTTPS only)
- Implement proper access controls (users can only access their own data)
- Hash passwords using bcrypt or similar (minimum 10 rounds)
- Implement secure session management
- Regular security audits and dependency updates

### API Security
- Use authentication for all endpoints (except public endpoints)
- Implement authorization checks for resource access
- Use API versioning
- Implement request validation with JSON schemas
- Log all authentication failures and suspicious activities

---

## 8. Git & Branching Workflow

### Branch Naming Convention
- **Feature branches**: `feature/order-status-tracking`
- **Bug fixes**: `bugfix/payment-calculation-error`
- **Hotfixes**: `hotfix/critical-security-patch`
- **Refactoring**: `refactor/order-service-cleanup`

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Example:
```
feat(order): add order status tracking

Implement order status workflow with database
persistence and real-time updates via WebSocket.

Closes #123
```

### Pull Request Guidelines
- Link to related issues or tasks
- Provide clear description of changes
- Include screenshots for UI changes
- Ensure all tests pass and coverage maintained
- Request reviews from at least 2 team members
- Squash commits before merging (keep history clean)

---

## 9. Documentation Requirements

### Code Documentation
- Document complex functions with JSDoc comments
- Include parameter types and return types
- Add usage examples for utility functions
- Document public APIs with request/response examples
- Keep documentation up-to-date with code changes

### JSDoc Template
```javascript
/**
 * Calculate the total price of an order including tax and shipping
 * @param {Object} order - The order object
 * @param {Array<Object>} order.items - Array of order items
 * @param {number} order.items[].price - Price per item
 * @param {number} order.items[].quantity - Quantity ordered
 * @param {number} shippingCost - Shipping cost in dollars
 * @returns {number} Total order price including tax and shipping
 * @throws {Error} If order data is invalid
 * @example
 * const total = calculateOrderTotal({ items: [...] }, 10);
 * console.log(total); // 125.50
 */
function calculateOrderTotal(order, shippingCost) {
  // Implementation
}
```

### Project Documentation
- Maintain up-to-date README with setup instructions
- Document API endpoints in `docs/API.md`
- Provide architecture overview in `docs/ARCHITECTURE.md`
- Include troubleshooting guide in `docs/TROUBLESHOOTING.md`
- Keep CHANGELOG.md updated with releases

---

## 10. Common Patterns & Anti-patterns

### Good Patterns
✅ Use custom hooks for shared logic
✅ Use composition over inheritance
✅ Separate concerns (services for API calls, components for UI)
✅ Use environment variables for configuration
✅ Implement proper error boundaries
✅ Use React Context for global state (if Redux not needed)
✅ Extract magic strings to constants
✅ Implement loading and error states in UI

### Anti-patterns to Avoid
❌ Prop drilling (pass too many props through components)
❌ API calls directly in components (use custom hooks/services)
❌ State mutations (always create new state objects)
❌ Missing error handling in async operations
❌ Hard-coded values in components
❌ Storing unnecessary data in global state
❌ Ignoring test coverage metrics
❌ Overly complex component logic

---

## 11. Helpful Resources

- **React Documentation**: https://react.dev
- **Testing Library**: https://testing-library.com/react
- **Jest Documentation**: https://jestjs.io
- **ESLint Rules**: https://eslint.org/docs/rules/
- **Prettier Code Formatter**: https://prettier.io

---

## 12. Questions & Support

For clarifications on these guidelines:
1. Check existing code in the repository
2. Review similar implementations in the codebase
3. Ask in team discussions or open an issue
4. Refer to pull request comments from previous reviews

---

**Last Updated**: 2025-12-19
**Maintained By**: Xpert Forex Trade Inc. Development Team
