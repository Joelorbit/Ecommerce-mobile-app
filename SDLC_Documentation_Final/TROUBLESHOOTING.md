# Troubleshooting Guide

## 🔧 Issue Resolution Procedures

This guide provides systematic approaches to identify, diagnose, and resolve common issues in the e-commerce mobile application across all components.

---

## 1. Issue Classification & Priority

### Severity Levels

| Level        | Description                             | Response Time        | Examples                                       |
| ------------ | --------------------------------------- | -------------------- | ---------------------------------------------- |
| **Critical** | System down, data loss, security breach | Immediate (< 1 hour) | Payment processing failure, complete app crash |
| **High**     | Major functionality broken              | < 4 hours            | Login failure, checkout not working            |
| **Medium**   | Feature partially broken                | < 24 hours           | Slow performance, minor UI issues              |
| **Low**      | Cosmetic or minor issues                | < 72 hours           | Typos, styling inconsistencies                 |

### Issue Categories

- **🔐 Authentication Issues**
- **📱 Mobile App Problems**
- **🖥️ API/Backend Issues**
- **💾 Database Problems**
- **🔄 Real-time Sync Issues**
- **💳 Payment Processing**
- **📊 Performance Issues**
- **🔒 Security Concerns**

---

## 2. Authentication Issues

### User Cannot Login

#### Symptoms

- Login button unresponsive
- "Invalid credentials" error
- Password reset not working
- Account lockout

#### Diagnostic Steps

```bash
# 1. Check Supabase Auth service status
curl -X GET https://your-project.supabase.co/rest/v1/ \
  -H "apikey: your-anon-key"

# 2. Verify user exists in database
SELECT id, email, created_at FROM auth.users
WHERE email = 'user@example.com';

# 3. Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

#### Common Solutions

**Invalid Credentials Error:**

```sql
-- Check if user account is confirmed
SELECT confirmed_at FROM auth.users WHERE email = 'user@example.com';

-- Reset password via Supabase dashboard if needed
-- Or use password reset API
```

**Account Lockout:**

```sql
-- Check failed login attempts (if tracking enabled)
SELECT * FROM auth.audit_log_entries
WHERE payload->>'email' = 'user@example.com'
ORDER BY created_at DESC LIMIT 5;
```

### JWT Token Issues

#### Symptoms

- User logged out unexpectedly
- API calls returning 401 errors
- Token expiration errors

#### Resolution Steps

```javascript
// Check token expiration in mobile app
const token = await AsyncStorage.getItem("auth_token");
if (token) {
  const decoded = jwt.decode(token);
  console.log("Token expires:", new Date(decoded.exp * 1000));
}

// Refresh token programmatically
const { data, error } = await supabase.auth.refreshSession();
```

---

## 3. Mobile App Issues

### App Crashes on Startup

#### iOS Crash Diagnosis

```bash
# Check device logs
xcrun simctl spawn booted log show --predicate 'process == "YourAppName"' --last 1h

# Check for Expo errors
npx expo install --fix
```

#### Android Crash Diagnosis

```bash
# Check Android logs
adb logcat | grep -i "yourappname"

# Clear app data and cache
adb shell pm clear com.yourcompany.yourapp
```

#### Common Crash Causes

- **Memory Issues:** Large images not optimized
- **Network Timeouts:** API calls without proper error handling
- **State Management:** Zustand store corruption
- **Platform-specific Code:** iOS/Android compatibility issues

### Slow Performance

#### Performance Profiling

```bash
# Use React DevTools for component profiling
npx react-devtools

# Check bundle size
npx expo bundle-analyzer

# Monitor network requests
# Use Flipper or Charles Proxy
```

#### Optimization Steps

1. **Image Optimization:**

   ```javascript
   // Use proper image sizing
   <Image
     source={{ uri: imageUrl }}
     style={{ width: 200, height: 200 }}
     resizeMode="cover"
   />
   ```

2. **List Virtualization:**

   ```javascript
   // Use FlatList instead of ScrollView for long lists
   <FlatList
     data={products}
     renderItem={renderProduct}
     keyExtractor={(item) => item.id}
     initialNumToRender={10}
     maxToRenderPerBatch={10}
   />
   ```

3. **Memoization:**
   ```javascript
   // Memoize expensive calculations
   const productList = useMemo(
     () => products.filter((p) => p.category === selectedCategory),
     [products, selectedCategory],
   );
   ```

### Offline Functionality Issues

#### Cart Persistence Problems

```javascript
// Check AsyncStorage data
const cartData = await AsyncStorage.getItem("cart");
console.log("Cart data:", JSON.parse(cartData));

// Clear corrupted cart data
await AsyncStorage.removeItem("cart");
```

---

## 4. API & Backend Issues

### API Endpoint Failures

#### 500 Internal Server Error

```bash
# Check server logs
tail -f /var/log/application.log

# Test API connectivity
curl -X GET https://your-api-domain.com/health

# Check database connection
# In Node.js console
const { data, error } = await supabase.from('products').select('*').limit(1);
console.log('DB test:', { data, error });
```

#### 429 Rate Limit Exceeded

```javascript
// Implement exponential backoff
const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s...
await new Promise((resolve) => setTimeout(resolve, delay));

// Check rate limit headers
const response = await fetch("/api/products");
console.log(
  "Rate limit remaining:",
  response.headers.get("x-ratelimit-remaining"),
);
```

### Database Connection Issues

#### Connection Pool Exhaustion

```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Monitor connection age
SELECT pid, usename, client_addr, backend_start, query_start, state
FROM pg_stat_activity
WHERE state = 'active';

-- Kill idle connections if needed
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle' AND now() - query_start > interval '5 minutes';
```

#### Query Performance Issues

```sql
-- Analyze slow queries
EXPLAIN ANALYZE SELECT * FROM products WHERE category = 'Electronics';

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Add missing indexes
CREATE INDEX CONCURRENTLY idx_products_category ON products(category);
```

---

## 5. Real-time Sync Issues

### Live Updates Not Working

#### Supabase Realtime Diagnosis

```javascript
// Test real-time connection
const channel = supabase.channel("test");
channel.subscribe((status) => {
  console.log("Realtime status:", status);
});

// Check channel subscription
const { data, error } = await supabase.from("products").select("*").limit(1);

if (error) {
  console.error("Realtime setup error:", error);
}
```

#### WebSocket Connection Issues

```javascript
// Manual WebSocket test
const ws = new WebSocket("wss://your-project.supabase.co/realtime/v1");

ws.onopen = () => console.log("WebSocket connected");
ws.onmessage = (event) => console.log("Message:", event.data);
ws.onerror = (error) => console.error("WebSocket error:", error);

// Subscribe to changes
ws.send(
  JSON.stringify({
    event: "phx_join",
    payload: {
      config: {
        broadcast: { self: true },
        presence: { key: "" },
        postgres_changes: [
          {
            event: "*",
            schema: "public",
            table: "products",
          },
        ],
      },
    },
  }),
);
```

### Sync Conflicts

#### Resolution Strategy

```javascript
// Implement conflict resolution
const handleRealtimeUpdate = (payload) => {
  const { eventType, new: newRecord, old: oldRecord } = payload;

  if (eventType === "UPDATE") {
    // Check for conflicts
    const localVersion = getLocalVersion(oldRecord.id);
    if (localVersion > oldRecord.version) {
      // Local changes are newer, keep them
      return;
    }
    // Apply remote changes
    updateLocalRecord(newRecord);
  }
};
```

---

## 6. Payment Processing Issues

### Payment Failures

#### Stripe/Payment Processor Issues

```javascript
// Test payment intent creation
const { data, error } = await supabase.functions.invoke(
  "create-payment-intent",
  {
    body: { amount: 2999, currency: "usd" },
  },
);

if (error) {
  console.error("Payment creation failed:", error);
}

// Check webhook delivery
// In Stripe dashboard, check webhook attempts
```

#### Common Payment Errors

- **Card Declined:** Insufficient funds, expired card
- **3D Secure Required:** Additional authentication needed
- **Address Verification Failed:** Billing address mismatch
- **Fraud Detection:** Transaction flagged as suspicious

### Refund Processing

#### Refund Workflow

```javascript
// Process refund via API
const refundOrder = async (orderId, amount) => {
  try {
    // Update order status
    await supabase
      .from("orders")
      .update({ status: "refunded", refunded_amount: amount })
      .eq("id", orderId);

    // Process payment refund
    const { data, error } = await supabase.functions.invoke("process-refund", {
      body: { orderId, amount },
    });

    if (error) throw error;

    // Notify user
    await sendRefundNotification(orderId);
  } catch (error) {
    console.error("Refund processing failed:", error);
    // Rollback order status if needed
  }
};
```

---

## 7. Performance Issues

### High Memory Usage

#### Memory Leak Detection

```javascript
// Use React DevTools Memory tab
// Or add memory monitoring
import { PerformanceMonitor } from "react-native-performance-monitor";

PerformanceMonitor.start();

// Monitor memory usage
setInterval(() => {
  console.log("Memory usage:", performance.memory);
}, 5000);
```

#### Memory Optimization

```javascript
// Avoid memory leaks in useEffect
useEffect(() => {
  const subscription = supabase
    .channel("updates")
    .on("postgres_changes", handleUpdate)
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}, []);

// Use FlatList with proper keyExtractor
<FlatList
  data={items}
  keyExtractor={(item, index) => item.id.toString()}
  renderItem={renderItem}
/>;
```

### Slow API Responses

#### API Performance Tuning

```javascript
// Implement caching
const cache = new Map();

const cachedFetch = async (url, options = {}) => {
  const key = `${url}-${JSON.stringify(options)}`;

  if (cache.has(key)) {
    const { data, timestamp } = cache.get(key);
    if (Date.now() - timestamp < 300000) {
      // 5 minutes
      return data;
    }
  }

  const response = await fetch(url, options);
  const data = await response.json();

  cache.set(key, { data, timestamp: Date.now() });
  return data;
};
```

#### Database Query Optimization

```sql
-- Use pagination for large datasets
SELECT * FROM products
WHERE category = $1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;

-- Add composite indexes
CREATE INDEX idx_products_category_created ON products(category, created_at DESC);

-- Use EXPLAIN to analyze queries
EXPLAIN SELECT * FROM products WHERE price BETWEEN 100 AND 500;
```

---

## 8. Security Issues

### Data Breach Response

#### Immediate Actions

1. **Isolate Affected Systems**

   ```bash
   # Disconnect compromised systems
   # Change all access credentials
   # Notify security team
   ```

2. **Assess Damage**

   ```sql
   -- Check for unauthorized data access
   SELECT * FROM auth.audit_log_entries
   WHERE created_at > 'incident_timestamp'
   ORDER BY created_at DESC;
   ```

3. **Contain Breach**

   ```sql
   -- Revoke compromised tokens
   UPDATE auth.users SET encrypted_password = 'TEMP_DISABLED'
   WHERE id IN (SELECT user_id FROM compromised_sessions);

   -- Enable additional security measures
   ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
   ```

### Suspicious Activity Detection

#### Monitoring Setup

```sql
-- Create audit triggers
CREATE OR REPLACE FUNCTION audit_trigger_function() RETURNS trigger AS $$
BEGIN
  INSERT INTO audit_log (table_name, operation, old_values, new_values, user_id)
  VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), row_to_json(NEW), current_setting('request.jwt.claims', true)::json->>'sub');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to sensitive tables
CREATE TRIGGER audit_orders_trigger
  AFTER INSERT OR UPDATE OR DELETE ON orders
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

---

## 9. Emergency Procedures

### System Down Response

#### Critical Incident Response

1. **Assess Impact**
   - Which services are affected?
   - How many users impacted?
   - Is data at risk?

2. **Communication**
   - Notify stakeholders
   - Update status page
   - Inform customers if needed

3. **Recovery Actions**

   ```bash
   # Check service status
   curl -f https://your-api-domain.com/health || echo "API down"

   # Restart services
   # Railway/Render: Trigger redeploy
   # Manual: systemctl restart your-service

   # Database recovery
   # Supabase: Use backup restore
   ```

4. **Post-Incident Review**
   - Document what happened
   - Identify root cause
   - Implement preventive measures
   - Update incident response plan

### Data Loss Recovery

#### Database Restore Procedure

```bash
# Supabase backup restore
# 1. Access Supabase dashboard
# 2. Go to Database > Backups
# 3. Select restore point
# 4. Confirm restore operation

# Point-in-time recovery
pg_restore -h your-host -U your-user -d your-db backup-file.sql
```

#### Data Validation

```sql
-- Verify data integrity after restore
SELECT count(*) FROM products;
SELECT count(*) FROM orders WHERE created_at > 'restore_timestamp';

-- Check for data corruption
SELECT * FROM orders WHERE total_price < 0;
```

---

## 10. Support Resources

### Internal Resources

- **Team Chat:** Slack channel #ecommerce-support
- **Documentation:** Internal wiki and runbooks
- **Monitoring:** Grafana dashboards and alerts
- **Logs:** Centralized logging system

### External Resources

- **Supabase Status:** [status.supabase.com](https://status.supabase.com)
- **Expo Documentation:** [docs.expo.dev](https://docs.expo.dev)
- **React Native Issues:** [GitHub issues](https://github.com/facebook/react-native/issues)
- **PostgreSQL Docs:** [postgresql.org/docs](https://www.postgresql.org/docs/)

### Escalation Matrix

| Issue Severity | Initial Response  | Escalation Time | Escalation Contact  |
| -------------- | ----------------- | --------------- | ------------------- |
| **Critical**   | On-call engineer  | Immediate       | Engineering Manager |
| **High**       | Support team lead | < 30 minutes    | Tech Lead           |
| **Medium**     | Senior developer  | < 2 hours       | Development Team    |
| **Low**        | Junior developer  | < 24 hours      | Development Team    |

---

_This troubleshooting guide provides systematic procedures for resolving issues across all components of the e-commerce application. Regular updates ensure comprehensive coverage of new issues and solutions._
