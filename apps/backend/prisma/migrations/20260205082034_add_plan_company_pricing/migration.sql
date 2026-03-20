-- CreateTable
CREATE TABLE "PlanCompanyPricing" (
    "id" SERIAL NOT NULL,
    "planId" INTEGER NOT NULL,
    "companyTypeId" INTEGER NOT NULL,
    "monthlyPriceCents" INTEGER NOT NULL,
    "yearlyPriceCents" INTEGER NOT NULL,
    "yearlyDiscountPercent" INTEGER NOT NULL DEFAULT 20,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanCompanyPricing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlanCompanyPricing_planId_idx" ON "PlanCompanyPricing"("planId");

-- CreateIndex
CREATE INDEX "PlanCompanyPricing_companyTypeId_idx" ON "PlanCompanyPricing"("companyTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "PlanCompanyPricing_planId_companyTypeId_key" ON "PlanCompanyPricing"("planId", "companyTypeId");

-- AddForeignKey
ALTER TABLE "PlanCompanyPricing" ADD CONSTRAINT "PlanCompanyPricing_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanCompanyPricing" ADD CONSTRAINT "PlanCompanyPricing_companyTypeId_fkey" FOREIGN KEY ("companyTypeId") REFERENCES "CompanyType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
