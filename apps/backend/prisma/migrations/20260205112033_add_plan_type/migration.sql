-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('BASE', 'ADDON');

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "type" "PlanType" NOT NULL DEFAULT 'BASE';
