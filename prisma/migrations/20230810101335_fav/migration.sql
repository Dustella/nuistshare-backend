/*
  Warnings:

  - You are about to drop the column `userFavouriteId` on the `Archive` table. All the data in the column will be lost.
  - You are about to drop the column `userHistoryId` on the `Archive` table. All the data in the column will be lost.
  - You are about to drop the `UserFavourite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Archive" DROP CONSTRAINT "Archive_userFavouriteId_fkey";

-- DropForeignKey
ALTER TABLE "Archive" DROP CONSTRAINT "Archive_userHistoryId_fkey";

-- DropForeignKey
ALTER TABLE "UserFavourite" DROP CONSTRAINT "UserFavourite_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserHistory" DROP CONSTRAINT "UserHistory_userId_fkey";

-- AlterTable
ALTER TABLE "Archive" DROP COLUMN "userFavouriteId",
DROP COLUMN "userHistoryId",
ADD COLUMN     "usersFavId" INTEGER,
ADD COLUMN     "usersHisId" INTEGER;

-- DropTable
DROP TABLE "UserFavourite";

-- DropTable
DROP TABLE "UserHistory";

-- AddForeignKey
ALTER TABLE "Archive" ADD CONSTRAINT "Archive_usersFavId_fkey" FOREIGN KEY ("usersFavId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Archive" ADD CONSTRAINT "Archive_usersHisId_fkey" FOREIGN KEY ("usersHisId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
