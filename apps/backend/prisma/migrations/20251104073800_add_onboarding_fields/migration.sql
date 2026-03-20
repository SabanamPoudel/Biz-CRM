-- AlterTable
ALTER TABLE "User" ADD COLUMN     "billingType" TEXT,
ADD COLUMN     "businessType" TEXT,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "expeditedEIN" BOOLEAN DEFAULT false,
ADD COLUMN     "onboardingComplete" BOOLEAN DEFAULT false,
ADD COLUMN     "selectedPlan" TEXT,
ADD COLUMN     "selectedState" TEXT;
