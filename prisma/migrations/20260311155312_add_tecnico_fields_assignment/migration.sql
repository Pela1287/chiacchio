-- AlterTable
ALTER TABLE `solicitudes` ADD COLUMN `tecnicoId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `tecnicos` ADD COLUMN `antecedentes` TEXT NULL,
    ADD COLUMN `dni` VARCHAR(191) NULL,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `observaciones` TEXT NULL;

-- CreateIndex
CREATE INDEX `solicitudes_tecnicoId_idx` ON `solicitudes`(`tecnicoId`);

-- AddForeignKey
ALTER TABLE `solicitudes` ADD CONSTRAINT `solicitudes_tecnicoId_fkey` FOREIGN KEY (`tecnicoId`) REFERENCES `tecnicos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
