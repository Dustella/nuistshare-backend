-- CreateTable
CREATE TABLE "Archive" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "l1Class" TEXT NOT NULL,
    "l2Class" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "tags" TEXT[],
    "userFavouriteId" INTEGER,

    CONSTRAINT "Archive_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Metadata" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "href" TEXT NOT NULL,

    CONSTRAINT "Metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchiveExtern" (
    "id" SERIAL NOT NULL,
    "archiveId" INTEGER NOT NULL,
    "downloadCount" INTEGER NOT NULL,
    "viewCount" INTEGER NOT NULL,
    "favCount" INTEGER NOT NULL,

    CONSTRAINT "ArchiveExtern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFavourite" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserFavourite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArchiveExternToMetadata" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ArchiveExternToMetadata_AB_unique" ON "_ArchiveExternToMetadata"("A", "B");

-- CreateIndex
CREATE INDEX "_ArchiveExternToMetadata_B_index" ON "_ArchiveExternToMetadata"("B");

-- AddForeignKey
ALTER TABLE "Archive" ADD CONSTRAINT "Archive_userFavouriteId_fkey" FOREIGN KEY ("userFavouriteId") REFERENCES "UserFavourite"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchiveExtern" ADD CONSTRAINT "ArchiveExtern_archiveId_fkey" FOREIGN KEY ("archiveId") REFERENCES "Archive"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavourite" ADD CONSTRAINT "UserFavourite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArchiveExternToMetadata" ADD CONSTRAINT "_ArchiveExternToMetadata_A_fkey" FOREIGN KEY ("A") REFERENCES "ArchiveExtern"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArchiveExternToMetadata" ADD CONSTRAINT "_ArchiveExternToMetadata_B_fkey" FOREIGN KEY ("B") REFERENCES "Metadata"("id") ON DELETE CASCADE ON UPDATE CASCADE;
