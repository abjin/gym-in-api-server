-- CreateTable
CREATE TABLE `AttendanceChallengeConditions` (
    `challengeId` INTEGER NOT NULL,
    `startTime` VARCHAR(191) NOT NULL,
    `endTime` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`challengeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChallengeCertificationLogs` (
    `participantId` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,

    UNIQUE INDEX `ChallengeCertificationLogs_participantId_date_key`(`participantId`, `date`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AttendanceChallengeConditions` ADD CONSTRAINT `AttendanceChallengeConditions_challengeId_fkey` FOREIGN KEY (`challengeId`) REFERENCES `Challenges`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChallengeCertificationLogs` ADD CONSTRAINT `ChallengeCertificationLogs_participantId_fkey` FOREIGN KEY (`participantId`) REFERENCES `ChallengeParticipants`(`participantId`) ON DELETE RESTRICT ON UPDATE CASCADE;
