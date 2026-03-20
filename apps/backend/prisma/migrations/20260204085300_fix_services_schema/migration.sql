/*
  Warnings:

  - The `advantages` column on the `CompanyType` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `disadvantages` column on the `CompanyType` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `isFeatured` on the `Plan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CompanyType" DROP COLUMN "advantages",
ADD COLUMN     "advantages" TEXT[],
DROP COLUMN "disadvantages",
ADD COLUMN     "disadvantages" TEXT[];

-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "isFeatured",
ADD COLUMN     "isPopular" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "monthlyPriceCents" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "yearlyPriceCents" INTEGER NOT NULL DEFAULT 0;
