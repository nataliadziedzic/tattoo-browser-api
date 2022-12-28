/*
  Warnings:

  - You are about to drop the column `techniques` on the `Client` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" DROP COLUMN "techniques",
ADD COLUMN     "preferredTechniques" TEXT[];
