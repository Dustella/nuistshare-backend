/*
  Warnings:

  - You are about to drop the `_ArchiveExternToMetadata` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ArchiveExternToMetadata" DROP CONSTRAINT "_ArchiveExternToMetadata_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArchiveExternToMetadata" DROP CONSTRAINT "_ArchiveExternToMetadata_B_fkey";

-- AlterTable
ALTER TABLE "Metadata" ADD COLUMN     "archiveExternId" INTEGER;

-- DropTable
DROP TABLE "_ArchiveExternToMetadata";

-- AddForeignKey
ALTER TABLE "Metadata" ADD CONSTRAINT "Metadata_archiveExternId_fkey" FOREIGN KEY ("archiveExternId") REFERENCES "ArchiveExtern"("id") ON DELETE SET NULL ON UPDATE CASCADE;
