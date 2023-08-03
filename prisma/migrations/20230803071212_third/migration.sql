/*
  Warnings:

  - You are about to drop the column `href` on the `Metadata` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Metadata` table. All the data in the column will be lost.
  - Added the required column `driver` to the `Metadata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `label` to the `Metadata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `target` to the `Metadata` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Archive" ADD COLUMN     "public" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userHistoryId" INTEGER;

-- AlterTable
ALTER TABLE "Metadata" DROP COLUMN "href",
DROP COLUMN "type",
ADD COLUMN     "driver" TEXT NOT NULL,
ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "target" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateTable
CREATE TABLE "UserHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Archive" ADD CONSTRAINT "Archive_userHistoryId_fkey" FOREIGN KEY ("userHistoryId") REFERENCES "UserHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHistory" ADD CONSTRAINT "UserHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
