/*
  Warnings:

  - You are about to drop the `PlanCompanyPricing` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PlanCompanyPricing" DROP CONSTRAINT "PlanCompanyPricing_companyTypeId_fkey";

-- DropForeignKey
ALTER TABLE "PlanCompanyPricing" DROP CONSTRAINT "PlanCompanyPricing_planId_fkey";

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "companyTypeId" INTEGER,
ADD COLUMN     "yearlyDiscountPercent" INTEGER NOT NULL DEFAULT 20;

-- DropTable
DROP TABLE "PlanCompanyPricing";

-- CreateIndex
CREATE INDEX "Plan_companyTypeId_idx" ON "Plan"("companyTypeId");

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_companyTypeId_fkey" FOREIGN KEY ("companyTypeId") REFERENCES "CompanyType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
