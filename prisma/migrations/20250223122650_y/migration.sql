-- DropForeignKey
ALTER TABLE `Attendances` DROP FOREIGN KEY `Attendances_owner_fkey`;

-- DropForeignKey
ALTER TABLE `Exercises` DROP FOREIGN KEY `Exercises_attendanceId_fkey`;

-- AddForeignKey
ALTER TABLE `Attendances` ADD CONSTRAINT `Attendances_owner_fkey` FOREIGN KEY (`owner`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exercises` ADD CONSTRAINT `Exercises_attendanceId_fkey` FOREIGN KEY (`attendanceId`) REFERENCES `Attendances`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
