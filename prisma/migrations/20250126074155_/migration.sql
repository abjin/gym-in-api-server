-- CreateTable
CREATE TABLE `ChallengeParticipants` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `challengeId` INTEGER NOT NULL,
    `challengeType` ENUM('attendanceTime') NOT NULL,
    `goalDays` INTEGER NOT NULL,
    `successDays` INTEGER NOT NULL DEFAULT 0,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `participatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
