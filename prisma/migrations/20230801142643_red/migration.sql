/*
  Warnings:

  - You are about to drop the column `archiveExternId` on the `Metadata` table. All the data in the column will be lost.
  - You are about to drop the `ArchiveExtern` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `downloadCount` to the `Archive` table without a default value. This is not possible if the table is not empty.
  - Added the required column `favCount` to the `Archive` table without a default value. This is not possible if the table is not empty.
  - Added the required column `viewCount` to the `Archive` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ArchiveExtern" DROP CONSTRAINT "ArchiveExtern_archiveId_fkey";

-- DropForeignKey
ALTER TABLE "Metadata" DROP CONSTRAINT "Metadata_archiveExternId_fkey";

-- AlterTable
ALTER TABLE "Archive" ADD COLUMN     "downloadCount" INTEGER NOT NULL,
ADD COLUMN     "favCount" INTEGER NOT NULL,
ADD COLUMN     "viewCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Metadata" DROP COLUMN "archiveExternId",
ADD COLUMN     "archiveId" INTEGER;

-- DropTable
DROP TABLE "ArchiveExtern";

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_archiveId_fkey" FOREIGN KEY ("archiveId") REFERENCES "Archive"("id") ON DELETE SET NULL ON UPDATE CASCADE;
