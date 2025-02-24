-- CreateTable
CREATE TABLE `AttendanceGoals` (
    `owner` VARCHAR(191) NOT NULL,
    `type` ENUM('monthly', 'weekly') NOT NULL,
    `startDate` DATE NOT NULL,
    `endDate` DATE NOT NULL,
    `goal` INTEGER NOT NULL,

    UNIQUE INDEX `AttendanceGoals_owner_type_startDate_endDate_key`(`owner`, `type`, `startDate`, `endDate`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AttendanceGoals` ADD CONSTRAINT `AttendanceGoals_owner_fkey` FOREIGN KEY (`owner`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
