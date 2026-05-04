# Deployment Guide

## 🚀 Production Deployment Procedures

This guide provides comprehensive instructions for deploying the e-commerce mobile application to production environments across all platforms and services.

---

## 1. Pre-Deployment Checklist

### ✅ Environment Preparation

#### Supabase Setup

- [ ] **Project Created:** Production Supabase project initialized
- [ ] **Database Schema:** All tables and policies deployed
- [ ] **Authentication:** Email templates configured
- [ ] **Storage Buckets:** Product images bucket created
- [ ] **Environment Variables:** Production secrets configured
- [ ] **RLS Policies:** Row-level security enabled and tested

#### API Server Preparation

- [ ] **Server Provisioned:** Hosting platform ready (Railway/Render/Vercel)
- [ ] **Environment Variables:** Production configuration set
- [ ] **Database Connection:** Supabase connection verified
- [ ] **SSL Certificate:** HTTPS enabled
- [ ] **Domain Configuration:** Custom domain pointed to server

#### Mobile App Preparation

- [ ] **App Store Accounts:** Developer accounts active
- [ ] **Code Signing:** Production certificates configured
- [ ] **App Icons:** All required icon sizes generated
- [ ] **Screenshots:** App store screenshots prepared
- [ ] **Privacy Policy:** Legal documents ready
- [ ] **Terms of Service:** User agreement documents ready

### ✅ Security Verification

#### Authentication & Authorization

- [ ] **JWT Secrets:** Strong, unique production secrets
- [ ] **API Keys:** Supabase keys properly scoped
- [ ] **CORS Policy:** Production domains whitelisted
- [ ] **Rate Limiting:** DDoS protection configured

#### Data Protection

- [ ] **Encryption:** Data at rest encryption enabled
- [ ] **Backup Strategy:** Automated backup schedule set
- [ ] **Data Retention:** GDPR compliance policies active
- [ ] **Audit Logging:** Security events being logged

### ✅ Performance Optimization

#### Frontend Optimization

- [ ] **Bundle Analysis:** Production bundle optimized
- [ ] **Image Optimization:** CDN configuration verified
- [ ] **Caching Strategy:** Service worker configured
- [ ] **Code Splitting:** Lazy loading implemented

#### Backend Optimization

- [ ] **Database Indexes:** Query performance optimized
- [ ] **Connection Pooling:** Database connections configured
- [ ] **Caching Layer:** Redis/API caching enabled
- [ ] **CDN Integration:** Static assets distributed

---

## 2. Database Deployment

### Initial Schema Deployment

#### Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to production project
supabase link --project-ref your-production-project-ref

# Push schema changes
supabase db push

# Apply RLS policies
supabase db reset
```

#### Manual Schema Application

If CLI is not available, execute the SQL migration files in order:

1. **Initial Schema** (`supabase/migrations/20240101000000_initial_schema.sql`)
2. **Indexes** (`supabase/migrations/20240102000000_add_indexes.sql`)
3. **RLS Policies** (Apply manually in Supabase dashboard)

### Seed Data Deployment

#### Production Seed Script

```sql
-- Insert initial product categories
INSERT INTO products (name, description, price, category) VALUES
  ('Sample Product 1', 'Description for sample product', 29.99, 'Electronics'),
  ('Sample Product 2', 'Another sample product', 49.99, 'Sports');

-- Create admin user (password to be set via Supabase Auth)
-- Note: Admin creation handled through Supabase dashboard
```

#### Data Validation

```sql
-- Verify table creation
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies WHERE schemaname = 'public';

-- Validate indexes
SELECT indexname, tablename, indexdef
FROM pg_indexes WHERE schemaname = 'public';
```

---

## 3. Backend API Deployment

### Environment Configuration

#### Production Environment Variables

```bash
# Server Configuration
NODE_ENV=production
PORT=3000

# Supabase Production
SUPABASE_URL=https://your-production-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key

# JWT Configuration
JWT_SECRET=your-production-jwt-secret-key-here
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=https://your-app-store-url.com

# Logging
LOG_LEVEL=warn
```

### Deployment Steps

#### Option 1: Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link project
railway login
railway link

# Set environment variables
railway variables set NODE_ENV=production
railway variables set SUPABASE_URL=https://your-project.supabase.co
# ... set other variables

# Deploy
railway up
```

#### Option 2: Render Deployment

```yaml
# render.yaml
services:
  - type: web
    name: ecommerce-api
    runtime: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: SUPABASE_URL
        fromSecret: supabase-url
      - key: SUPABASE_SERVICE_ROLE_KEY
        fromSecret: supabase-service-key
      - key: JWT_SECRET
        fromSecret: jwt-secret
```

#### Option 3: Manual Server Deployment

```bash
# On production server
git clone https://github.com/your-repo/ecommerce-api.git
cd ecommerce-api
npm ci --production
npm run build
npm start
```

### Health Check Verification

#### API Endpoints Testing

```bash
# Test basic connectivity
curl -X GET https://your-api-domain.com/health

# Test authentication
curl -X POST https://your-api-domain.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass"}'

# Test product retrieval
curl -X GET https://your-api-domain.com/products \
  -H "Authorization: Bearer your-jwt-token"
```

---

## 4. Mobile App Deployment

### iOS App Store Deployment

#### Code Signing Setup

```bash
# Install EAS CLI
npm install -g @expo/cli

# Configure EAS
eas build:configure

# Create production build
eas build --platform ios --profile production
```

#### App Store Connect Configuration

1. **Create App Record**
   - App name, description, keywords
   - Screenshots (6.5", 5.5", iPad)
   - App icons (1024x1024)
   - Privacy policy URL

2. **Build Upload**

   ```bash
   # Submit build to App Store
   eas submit --platform ios --profile production
   ```

3. **App Review Process**
   - Fill out contact information
   - Provide demo account credentials
   - Respond to reviewer questions
   - Average review time: 24-48 hours

### Android Google Play Deployment

#### Play Console Setup

```bash
# Create Android production build
eas build --platform android --profile production
```

#### Google Play Console Steps

1. **Create App**
   - App name and description
   - Screenshots (phone, tablet, Android TV)
   - Feature graphic and icons

2. **Upload Bundle**

   ```bash
   # Download AAB from EAS and upload to Play Console
   # Or use internal testing track first
   eas build --platform android --profile production
   ```

3. **Publishing Process**
   - Internal testing (optional)
   - Closed testing (beta)
   - Open testing (alpha)
   - Production release

### App Store Optimization (ASO)

#### iOS ASO Checklist

- [ ] **App Name:** Include target keywords
- [ ] **Subtitle:** 30 characters highlighting benefits
- [ ] **Keywords:** 100 characters of relevant terms
- [ ] **Description:** Feature-rich with keywords
- [ ] **Screenshots:** Show key features and UI
- [ ] **Icon:** Distinctive and professional

#### Android ASO Checklist

- [ ] **App Name:** Include primary keyword
- [ ] **Short Description:** 80 characters
- [ ] **Full Description:** Detailed with keywords
- [ ] **Screenshots:** 8 screenshots showing features
- [ ] **Feature Graphic:** 1024x500 promotional image

---

## 5. Post-Deployment Verification

### Functional Testing

#### Critical Path Testing

- [ ] **User Registration:** Complete signup flow
- [ ] **User Login:** Authentication works
- [ ] **Product Browsing:** Catalog loads correctly
- [ ] **Add to Cart:** Cart functionality works
- [ ] **Checkout Process:** Payment processing succeeds
- [ ] **Order History:** Past orders display
- [ ] **Admin Access:** Admin panel loads

#### Cross-Platform Testing

- [ ] **iOS Compatibility:** iOS 12+ devices
- [ ] **Android Compatibility:** Android 8+ devices
- [ ] **Network Conditions:** 3G, 4G, WiFi
- [ ] **Offline Mode:** Graceful degradation

### Performance Validation

#### Load Testing

```bash
# Use Artillery for load testing
npm install -g artillery

# Run load test
artillery run load-test.yml

# Quick performance check
curl -w "@curl-format.txt" -o /dev/null -s https://your-api-domain.com/products
```

#### Monitoring Setup

- [ ] **Error Tracking:** Sentry configured
- [ ] **Performance Monitoring:** Firebase Performance
- [ ] **Analytics:** User behavior tracking
- [ ] **Uptime Monitoring:** External monitoring service

### Security Audit

#### Pre-Launch Security Check

- [ ] **SSL Certificate:** Valid and current
- [ ] **Security Headers:** Properly configured
- [ ] **Data Encryption:** At rest and in transit
- [ ] **API Security:** Rate limiting active
- [ ] **Authentication:** Secure token handling

---

## 6. Rollback Procedures

### Emergency Rollback Plan

#### Mobile App Rollback

```bash
# iOS App Store rollback
# 1. Access App Store Connect
# 2. Go to App Store > Versions
# 3. Select previous version
# 4. Submit for review (expedited)

# Android Play Console rollback
# 1. Open Play Console
# 2. Go to Release > Production
# 3. Create new release with previous AAB
# 4. Roll out gradually or immediately
```

#### API Rollback

```bash
# If using Railway/Render
# 1. Access deployment dashboard
# 2. Roll back to previous deployment
# 3. Verify functionality

# Manual rollback
git checkout previous-commit-hash
npm run build
npm start
```

#### Database Rollback

```sql
-- Create restore point before deployment
-- In case of issues, restore from backup
-- Supabase provides automatic backups

-- Emergency data fix example
UPDATE orders SET status = 'confirmed'
WHERE status = 'processing' AND created_at < '2024-01-01';
```

### Rollback Decision Criteria

- **Critical Bug:** Affects core functionality for >50% users
- **Security Issue:** Potential data breach or vulnerability
- **Performance Issue:** >50% degradation in key metrics
- **Payment Failure:** Checkout process completely broken

---

## 7. Monitoring & Maintenance

### Production Monitoring Setup

#### Key Metrics to Monitor

- **Application Performance**
  - App launch time
  - API response times
  - Error rates
  - Crash reports

- **Business Metrics**
  - Daily active users
  - Conversion rates
  - Order volume
  - Revenue tracking

- **Infrastructure Metrics**
  - Server CPU/memory usage
  - Database connection count
  - API rate limits
  - CDN performance

#### Alert Configuration

```yaml
# Example alerting rules
alerts:
  - name: High Error Rate
    condition: error_rate > 5%
    duration: 5m
    channels: [slack, email]

  - name: Slow API Response
    condition: p95_response_time > 1000ms
    duration: 10m
    channels: [slack]

  - name: Database Connection Issues
    condition: active_connections > 80%
    duration: 5m
    channels: [email]
```

### Regular Maintenance Tasks

#### Weekly Tasks

- [ ] **Log Review:** Check error logs and performance metrics
- [ ] **Database Cleanup:** Remove old temporary data
- [ ] **Security Updates:** Apply security patches
- [ ] **Backup Verification:** Confirm backups are working

#### Monthly Tasks

- [ ] **Performance Audit:** Full performance review
- [ ] **Security Assessment:** Vulnerability scanning
- [ ] **User Feedback Review:** Analyze support tickets
- [ ] **Feature Usage Analysis:** Review analytics data

#### Quarterly Tasks

- [ ] **Platform Updates:** Update to latest versions
- [ ] **Load Testing:** Stress test with increased load
- [ ] **Compliance Review:** GDPR and accessibility audit
- [ ] **Competitive Analysis:** Review market position

---

## 8. Go-Live Checklist

### Final Pre-Launch Verification

#### Technical Readiness

- [ ] **All Environments:** Staging mirrors production
- [ ] **Data Migration:** Production data seeded correctly
- [ ] **Third-party Integrations:** Payment processors active
- [ ] **CDN Configuration:** Assets loading from CDN
- [ ] **Domain Setup:** SSL certificates valid

#### Business Readiness

- [ ] **Marketing Materials:** App store listings complete
- [ ] **Support Team:** Customer service prepared
- [ ] **Legal Compliance:** Privacy policy and terms posted
- [ ] **Communication Plan:** User notification strategy ready

#### Team Readiness

- [ ] **Runbook Documentation:** Incident response procedures
- [ ] **Contact Lists:** Emergency contact information
- [ ] **Escalation Paths:** Clear decision-making hierarchy
- [ ] **Success Metrics:** KPI tracking configured

### Launch Day Procedures

#### Pre-Launch (T-24 hours)

- [ ] **Final Testing:** Complete end-to-end test suite
- [ ] **Team Standup:** Final readiness review
- [ ] **Stakeholder Notification:** Launch timeline communicated
- [ ] **Monitoring Activation:** All alerts enabled

#### Launch Execution (T-0)

- [ ] **App Store Submission:** Submit final builds
- [ ] **API Deployment:** Deploy production API
- [ ] **Database Verification:** Final data integrity check
- [ ] **Team Monitoring:** 24/7 monitoring begins

#### Post-Launch (First 24 hours)

- [ ] **User Feedback Monitoring:** Track initial reviews
- [ ] **Performance Monitoring:** Watch key metrics closely
- [ ] **Issue Response:** Rapid response to critical issues
- [ ] **Success Celebration:** Team recognition and review

---

_This deployment guide ensures a smooth, secure, and successful production launch of the e-commerce mobile application across all platforms and services._
