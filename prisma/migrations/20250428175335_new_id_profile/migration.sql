-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("id");
