-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `sucursalId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `sucursales` (
    `id` VARCHAR(191) NOT NULL,
    `codigo` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `activa` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sucursales_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_sucursalId_fkey` FOREIGN KEY (`sucursalId`) REFERENCES `sucursales`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
