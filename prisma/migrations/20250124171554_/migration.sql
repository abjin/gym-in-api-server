/*
  Warnings:

  - You are about to drop the column `likesCounts` on the `Posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Posts` DROP COLUMN `likesCounts`,
    ADD COLUMN `likeCounts` INTEGER NOT NULL DEFAULT 0;
