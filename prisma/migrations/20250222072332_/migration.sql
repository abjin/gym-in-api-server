-- DropForeignKey
ALTER TABLE `Comments` DROP FOREIGN KEY `Comments_owner_fkey`;

-- DropForeignKey
ALTER TABLE `FeedLikes` DROP FOREIGN KEY `FeedLikes_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Feeds` DROP FOREIGN KEY `Feeds_owner_fkey`;

-- DropIndex
DROP INDEX `Comments_owner_fkey` ON `Comments`;

-- DropIndex
DROP INDEX `FeedLikes_userId_fkey` ON `FeedLikes`;

-- DropIndex
DROP INDEX `Feeds_owner_fkey` ON `Feeds`;

-- AddForeignKey
ALTER TABLE `Feeds` ADD CONSTRAINT `Feeds_owner_fkey` FOREIGN KEY (`owner`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FeedLikes` ADD CONSTRAINT `FeedLikes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_owner_fkey` FOREIGN KEY (`owner`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
