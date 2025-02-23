-- CreateTable
CREATE TABLE `Attendances` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `owner` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Attendances_owner_date_key`(`owner`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Exercises` (
    `attendanceId` INTEGER NOT NULL,
    `type` ENUM('chest', 'back', 'shoulder', 'arm', 'leg', 'cardio') NOT NULL,

    PRIMARY KEY (`attendanceId`, `type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Attendances` ADD CONSTRAINT `Attendances_owner_fkey` FOREIGN KEY (`owner`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exercises` ADD CONSTRAINT `Exercises_attendanceId_fkey` FOREIGN KEY (`attendanceId`) REFERENCES `Attendances`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
