# Services Module Migration Guide

## B) MIGRATIONS

### Step 1: Create and Apply Migration

```bash
cd /Users/sabanampoudel/Desktop/biz-crm-main/apps/backend
npx prisma migrate dev --name add_services_module
```

This will:
- Create migration SQL file
- Apply it to your database
- Generate Prisma Client with new models

### Step 2: Verify Migration
```bash
npx prisma generate
```

### Step 3: Verification in Prisma Studio

```bash
npx prisma studio
```

Open http://localhost:5555 and verify these models exist:
- ✅ CompanyType
- ✅ Category  
- ✅ Service
- ✅ ServiceFeature
- ✅ ServiceCategory
- ✅ ServiceCompanyPricing
- ✅ Plan
- ✅ PlanService

### Step 4: Seed Initial Data (via Prisma Studio or API)

#### 4.1: Create Company Types (in order)
1. **LLC**
   - name: "LLC"
   - slug: "llc"
   - description: "Limited Liability Company"
   - advantages: "Personal asset protection, flexible management structure, pass-through taxation"
   - disadvantages: "More paperwork than sole proprietorship, may have self-employment taxes"
   - isActive: true
   - sortOrder: 1

2. **C-Corp**
   - name: "C-Corporation"
   - slug: "c-corp"
   - description: "C Corporation"
   - advantages: "Unlimited growth potential, easier to raise capital, transferable ownership"
   - disadvantages: "Double taxation, more regulations, higher setup costs"
   - isActive: true
   - sortOrder: 2

3. **S-Corp**
   - name: "S-Corporation"
   - slug: "s-corp"
   - description: "S Corporation"
   - advantages: "Pass-through taxation, personal asset protection, credibility"
   - disadvantages: "Strict ownership rules, more IRS scrutiny, limited stock classes"
   - isActive: true
   - sortOrder: 3

#### 4.2: Create Categories
1. **Formation**
   - name: "Formation"
   - slug: "formation"
   - description: "Essential services for starting your business"
   - icon: "🏢"
   - sortOrder: 1

2. **Compliance**
   - name: "Compliance"
   - slug: "compliance"
   - description: "Stay compliant with state and federal requirements"
   - icon: "✅"
   - sortOrder: 2

3. **Tax Services**
   - name: "Tax Services"
   - slug: "tax-services"
   - description: "Tax filing and planning services"
   - icon: "💰"
   - sortOrder: 3

4. **Add-ons**
   - name: "Add-ons"
   - slug: "add-ons"
   - description: "Optional services to enhance your business"
   - icon: "➕"
   - sortOrder: 4

#### 4.3: Create Sample Service (Formation Service)

1. **Create Service:**
   - name: "Company Formation"
   - slug: "company-formation"
   - description: "Complete business formation including state filing and registered agent"
   - type: "BASE"
   - billingInterval: "ONE_TIME"
   - isActive: true
   - sortOrder: 1

2. **Add Features to Service** (create ServiceFeature records):
   - "Articles of Organization/Incorporation filing"
   - "Registered agent for 1 year"
   - "EIN application"
   - "Operating Agreement template"

3. **Link to Category** (create ServiceCategory record):
   - Link service to "Formation" category

4. **Set Pricing per Company Type** (create ServiceCompanyPricing records):
   - LLC: $299.00 → 29900 cents
   - C-Corp: $499.00 → 49900 cents
   - S-Corp: $499.00 → 49900 cents

#### 4.4: Create Sample Plan

1. **Create Plan:**
   - name: "Starter Plan"
   - slug: "starter"
   - description: "Everything you need to start your business"
   - isActive: true
   - isFeatured: true
   - sortOrder: 1

2. **Link Services to Plan** (create PlanService record):
   - Link "Company Formation" service to "Starter Plan"

### Step 5: Migrate Existing Companies (Safe Migration Path)

**IMPORTANT:** The schema now has both `selectedPlan` (legacy string) and `planId` (new relation).

**Migration Strategy:**
1. Keep `selectedPlan` field populated for backward compatibility
2. Gradually migrate companies to use `planId`:
   - Create Plan records matching your legacy plan names
   - Update Company records to set planId where plan exists
3. Once all companies migrated, `selectedPlan` can remain as fallback or be removed in future

**Example API to migrate:**
```typescript
// For each company with selectedPlan="starter"
const starterPlan = await prisma.plan.findUnique({ where: { slug: 'starter' } });
await prisma.company.update({
  where: { id: companyId },
  data: { planId: starterPlan.id }
});
```

### Verification Checklist

After seeding:
- [ ] 3 Company Types created (LLC, C-Corp, S-Corp)
- [ ] 4 Categories created (Formation, Compliance, Tax Services, Add-ons)
- [ ] 1 Service created (Company Formation) with type=BASE
- [ ] 4 Features linked to service
- [ ] 1 Category link (Formation → Company Formation)
- [ ] 3 Pricing records (LLC, C-Corp, S-Corp pricing for Company Formation)
- [ ] 1 Plan created (Starter Plan)
- [ ] 1 Plan-Service link (Starter → Company Formation)
- [ ] Company model has planId field (nullable)

---

## Common Issues & Solutions

**Issue:** Migration fails with "relation already exists"
**Solution:** Run `npx prisma migrate reset --force` to reset and reapply all migrations

**Issue:** Can't find new models in code
**Solution:** Run `npx prisma generate` to regenerate Prisma Client

**Issue:** Existing companies show no plan
**Solution:** This is expected. Set `planId` via admin UI or keep using `selectedPlan` as fallback
