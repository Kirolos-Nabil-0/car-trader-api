/*
  Warnings:

  - Added the required column `img` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Car_makeId_fkey` ON `car`;

-- DropIndex
DROP INDEX `Car_regionId_fkey` ON `car`;

-- DropIndex
DROP INDEX `Car_userId_fkey` ON `car`;

-- AlterTable
ALTER TABLE `car` ADD COLUMN `img` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `Region`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_makeId_fkey` FOREIGN KEY (`makeId`) REFERENCES `Make`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
