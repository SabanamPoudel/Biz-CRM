-- AlterTable
ALTER TABLE "User" ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "picture" TEXT,
ALTER COLUMN "passwordHash" DROP DEFAULT;
