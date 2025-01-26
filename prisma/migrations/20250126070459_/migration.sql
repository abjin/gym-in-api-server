-- CreateTable
CREATE TABLE `ChallengeRewards` (
    `challengeId` INTEGER NOT NULL,
    `days` INTEGER NOT NULL,
    `type` ENUM('experiencePoint') NOT NULL,
    `amount` INTEGER NOT NULL,

    PRIMARY KEY (`challengeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ChallengeRewards` ADD CONSTRAINT `ChallengeRewards_challengeId_fkey` FOREIGN KEY (`challengeId`) REFERENCES `Challenges`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
