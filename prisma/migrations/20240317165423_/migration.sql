-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT,
    "organizations" VARCHAR(255),
    "description" VARCHAR(255),
    "publications" VARCHAR(255),
    "twitterUrl" TEXT,
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "mediumUrl" TEXT,
    "image" VARCHAR(255),

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
