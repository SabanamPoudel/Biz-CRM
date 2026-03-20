# Company Type Based Plan Filtering

## Overview
Implemented a feature where Plans are filtered by Company Type during the onboarding process. Each plan is now associated with one Company Type, and customers only see plans relevant to their selected business type.

## Database Schema Changes

### Plan Model Updates
```prisma
model Plan {
  // ... existing fields
  companyTypeId Int?
  companyType CompanyType? @relation(fields: [companyTypeId], references: [id])
  yearlyDiscountPercent Int @default(20)
}

model CompanyType {
  // ... existing fields
  plans Plan[]
}
```

### Migration Applied
- **Migration**: `20260205082614_simplify_plan_company_type_relation`
- **Changes**: Added `companyTypeId` and `yearlyDiscountPercent` to Plan table

## API Endpoints Updated

### GET /api/plans
- **New Feature**: Query parameter filtering
- **Usage**: `/api/plans?company_type_id=1`
- **Returns**: Plans filtered by company type (or all plans if no filter)
- **Includes**: `companyType` relation in response

### POST /api/plans
- **New Fields**: 
  - `companyTypeId` (optional) - Links plan to a company type
  - `yearlyDiscountPercent` (default: 20) - Yearly discount percentage

### PUT /api/plans/[id]
- **New Fields**: Same as POST
- **Updates**: Can change company type association

## Admin Dashboard Changes

### Plans Management Page (`/dashboard/services/plans`)
- **New Dropdown**: "Company Type" selector in Add/Edit Plan modal
- **Features**:
  - Fetches company types from `/api/company-types`
  - Optional selection (can leave blank for plans available to all)
  - Shows selected company type in plan list
  
- **New Field**: Yearly Discount Percentage input (default 20%)

## Onboarding Flow Changes

### Package Selection Page (`/onboarding/package`)
- **Smart Filtering**: Automatically filters plans based on selected business type
- **Flow**:
  1. User selects business type (e.g., "LLC") in `/onboarding/business-type`
  2. Business type slug is saved to database and localStorage
  3. Package page loads company types from `/api/company-types`
  4. Matches business type slug to company type ID
  5. Fetches plans with `?company_type_id=X` filter
  6. Shows only relevant plans to the customer

## Usage Example

### Admin Creates Plan
1. Go to `/dashboard/services/plans`
2. Click "Add Plan"
3. Fill in plan details
4. Select "LLC" from Company Type dropdown
5. Set monthly/yearly prices
6. Save

### Customer Sees Filtered Plans
1. User starts onboarding
2. Selects "LLC" as business type
3. Navigates to package selection
4. Sees only plans associated with LLC
5. Plans for C-Corp, S-Corp, etc. are hidden

## Pricing Details

### Price Storage
- All prices stored in cents (Integer) in database
- Example: $299.00 = 29900 cents
- Prevents floating-point precision errors

### Yearly Discount
- Default: 20% off (Monthly × 12)
- Customizable per plan
- Admin can adjust in plan form

## Testing Checklist

- [ ] Create plan with company type in admin
- [ ] Create plan without company type (available to all)
- [ ] Edit plan and change company type
- [ ] Select LLC in onboarding → see only LLC plans
- [ ] Select C-Corp in onboarding → see only C-Corp plans
- [ ] Verify pricing displays correctly (dollars, not cents)
- [ ] Test yearly discount calculation
- [ ] Verify API filtering: `/api/plans?company_type_id=1`

## Future Enhancements

1. **Bulk Assignment**: Assign multiple plans to a company type at once
2. **Plan Templates**: Create default plans for each company type
3. **Analytics**: Track which plans are popular per company type
4. **Multi-Type Plans**: Allow plans to be available for multiple company types (if needed)

## Related Files

### Backend/Database
- `/apps/backend/prisma/schema.prisma` - Database schema
- `/apps/backend/prisma/migrations/20260205082614_*` - Migration file

### API Routes
- `/frontend/app/api/plans/route.ts` - GET/POST endpoints
- `/frontend/app/api/plans/[id]/route.ts` - PUT/DELETE endpoints
- `/frontend/app/api/company-types/route.ts` - Company types API

### Frontend Components
- `/frontend/app/dashboard/services/plans/page.tsx` - Admin plans management
- `/frontend/app/onboarding/package/page.tsx` - Customer plan selection
- `/frontend/app/onboarding/business-type/page.tsx` - Business type selection

## Notes

- Company Type association is **optional** - plans without a company type are shown to all users
- Filtering is done server-side via query parameters for better performance
- Business type slug (e.g., "llc") is matched to CompanyType records by slug field
- If no matching company type found, all active plans are shown
