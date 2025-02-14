/*
  Warnings:

  - A unique constraint covering the columns `[userId,challengeId]` on the table `ChallengeParticipants` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `AttendanceChallengeConditions` DROP FOREIGN KEY `AttendanceChallengeConditions_challengeId_fkey`;

-- DropForeignKey
ALTER TABLE `ChallengeCertificationLogs` DROP FOREIGN KEY `ChallengeCertificationLogs_participantId_fkey`;

-- DropForeignKey
ALTER TABLE `ChallengeParticipants` DROP FOREIGN KEY `ChallengeParticipants_challengeId_fkey`;

-- DropForeignKey
ALTER TABLE `ChallengeRewards` DROP FOREIGN KEY `ChallengeRewards_challengeId_fkey`;

-- DropForeignKey
ALTER TABLE `Comments` DROP FOREIGN KEY `Comments_feedId_fkey`;

-- DropForeignKey
ALTER TABLE `Comments` DROP FOREIGN KEY `Comments_owner_fkey`;

-- DropForeignKey
ALTER TABLE `FeedLikes` DROP FOREIGN KEY `FeedLikes_feedId_fkey`;

-- DropForeignKey
ALTER TABLE `FeedLikes` DROP FOREIGN KEY `FeedLikes_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Feeds` DROP FOREIGN KEY `Feeds_owner_fkey`;

-- DropIndex
DROP INDEX `ChallengeParticipants_challengeId_fkey` ON `ChallengeParticipants`;

-- DropIndex
DROP INDEX `Comments_feedId_fkey` ON `Comments`;

-- DropIndex
DROP INDEX `Comments_owner_fkey` ON `Comments`;

-- DropIndex
DROP INDEX `FeedLikes_userId_fkey` ON `FeedLikes`;

-- DropIndex
DROP INDEX `Feeds_owner_fkey` ON `Feeds`;

-- CreateIndex
CREATE UNIQUE INDEX `ChallengeParticipants_userId_challengeId_key` ON `ChallengeParticipants`(`userId`, `challengeId`);

-- AddForeignKey
ALTER TABLE `Feeds` ADD CONSTRAINT `Feeds_owner_fkey` FOREIGN KEY (`owner`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeedLikes` ADD CONSTRAINT `FeedLikes_feedId_fkey` FOREIGN KEY (`feedId`) REFERENCES `Feeds`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeedLikes` ADD CONSTRAINT `FeedLikes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_owner_fkey` FOREIGN KEY (`owner`) REFERENCES `Users`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_feedId_fkey` FOREIGN KEY (`feedId`) REFERENCES `Feeds`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChallengeRewards` ADD CONSTRAINT `ChallengeRewards_challengeId_fkey` FOREIGN KEY (`challengeId`) REFERENCES `Challenges`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChallengeParticipants` ADD CONSTRAINT `ChallengeParticipants_challengeId_fkey` FOREIGN KEY (`challengeId`) REFERENCES `Challenges`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttendanceChallengeConditions` ADD CONSTRAINT `AttendanceChallengeConditions_challengeId_fkey` FOREIGN KEY (`challengeId`) REFERENCES `Challenges`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChallengeCertificationLogs` ADD CONSTRAINT `ChallengeCertificationLogs_participantId_fkey` FOREIGN KEY (`participantId`) REFERENCES `ChallengeParticipants`(`participantId`) ON DELETE CASCADE ON UPDATE CASCADE;
