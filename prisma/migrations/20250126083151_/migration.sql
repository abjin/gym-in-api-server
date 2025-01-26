/*
  Warnings:

  - The primary key for the `ChallengeParticipants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ChallengeParticipants` table. All the data in the column will be lost.
  - Added the required column `participantId` to the `ChallengeParticipants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ChallengeParticipants` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `participantId` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`participantId`);

-- AddForeignKey
ALTER TABLE `ChallengeParticipants` ADD CONSTRAINT `ChallengeParticipants_challengeId_fkey` FOREIGN KEY (`challengeId`) REFERENCES `Challenges`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
