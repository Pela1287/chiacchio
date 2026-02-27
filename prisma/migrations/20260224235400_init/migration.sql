-- CreateTable
CREATE TABLE `usuarios` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `apellido` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NULL,
    `avatar` VARCHAR(191) NULL,
    `rol` ENUM('SUPER', 'ADMIN', 'CLIENTE') NOT NULL DEFAULT 'CLIENTE',
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `emailVerified` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cuentas` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    INDEX `cuentas_userId_fkey`(`userId`),
    UNIQUE INDEX `cuentas_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sesiones` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sesiones_sessionToken_key`(`sessionToken`),
    INDEX `sesiones_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tokens_verificacion` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tokens_verificacion_token_key`(`token`),
    UNIQUE INDEX `tokens_verificacion_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otp_requests` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `codigo` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `verificado` BOOLEAN NOT NULL DEFAULT false,
    `intentos` INTEGER NOT NULL DEFAULT 0,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `otp_requests_telefono_idx`(`telefono`),
    INDEX `otp_requests_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clientes` (
    `id` VARCHAR(191) NOT NULL,
    `usuarioId` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `apellido` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(191) NOT NULL,
    `ciudad` VARCHAR(191) NOT NULL,
    `codigoPostal` VARCHAR(191) NOT NULL,
    `notas` TEXT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `clientes_usuarioId_key`(`usuarioId`),
    INDEX `clientes_email_idx`(`email`),
    INDEX `clientes_telefono_idx`(`telefono`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `membresias` (
    `id` VARCHAR(191) NOT NULL,
    `clienteId` VARCHAR(191) NOT NULL,
    `plan` ENUM('BASICO', 'ESTANDAR', 'PREMIUM') NOT NULL,
    `precio` DECIMAL(10, 2) NOT NULL,
    `estado` ENUM('ACTIVA', 'PAUSADA', 'CANCELADA', 'VENCIDA') NOT NULL DEFAULT 'ACTIVA',
    `fechaInicio` DATETIME(3) NOT NULL,
    `fechaFin` DATETIME(3) NULL,
    `fechaProximoPago` DATETIME(3) NOT NULL,
    `serviciosDisponibles` INTEGER NOT NULL,
    `serviciosUsados` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `membresias_clienteId_idx`(`clienteId`),
    INDEX `membresias_estado_idx`(`estado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicios` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `categoria` ENUM('MANTENIMIENTO', 'OBRA', 'INSTALACION', 'REPARACION') NOT NULL,
    `tarifaBase` DECIMAL(10, 2) NOT NULL,
    `duracionEstimada` INTEGER NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `servicios_categoria_idx`(`categoria`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `solicitudes` (
    `id` VARCHAR(191) NOT NULL,
    `clienteId` VARCHAR(191) NOT NULL,
    `servicioId` VARCHAR(191) NOT NULL,
    `direccion` VARCHAR(191) NOT NULL,
    `ciudad` VARCHAR(191) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `estado` ENUM('PENDIENTE', 'CONFIRMADA', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA') NOT NULL DEFAULT 'PENDIENTE',
    `prioridad` ENUM('BAJA', 'MEDIA', 'ALTA', 'URGENTE') NOT NULL DEFAULT 'MEDIA',
    `fechaSolicitada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaProgramada` DATETIME(3) NULL,
    `fechaCompletada` DATETIME(3) NULL,
    `notas` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `solicitudes_clienteId_idx`(`clienteId`),
    INDEX `solicitudes_estado_idx`(`estado`),
    INDEX `solicitudes_servicioId_fkey`(`servicioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `presupuestos` (
    `id` VARCHAR(191) NOT NULL,
    `numero` INTEGER NOT NULL AUTO_INCREMENT,
    `clienteId` VARCHAR(191) NULL,
    `solicitudId` VARCHAR(191) NULL,
    `clienteNombre` VARCHAR(191) NULL,
    `clienteDireccion` VARCHAR(191) NULL,
    `clienteTelefono` VARCHAR(191) NULL,
    `clienteEmail` VARCHAR(191) NULL,
    `lugar` VARCHAR(191) NOT NULL DEFAULT 'La Plata',
    `fecha` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `subtotal` DECIMAL(12, 2) NOT NULL,
    `descuentoPorcentaje` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    `descuentoMonto` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `iva` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `total` DECIMAL(12, 2) NOT NULL,
    `financiacion` VARCHAR(191) NOT NULL DEFAULT 'contado',
    `cuotas` INTEGER NOT NULL DEFAULT 1,
    `estado` ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO', 'VENCIDO') NOT NULL DEFAULT 'PENDIENTE',
    `fechaEmision` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaValidez` DATETIME(3) NULL,
    `notas` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `presupuestos_numero_key`(`numero`),
    UNIQUE INDEX `presupuestos_solicitudId_key`(`solicitudId`),
    INDEX `presupuestos_clienteId_idx`(`clienteId`),
    INDEX `presupuestos_estado_idx`(`estado`),
    INDEX `presupuestos_solicitudId_idx`(`solicitudId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `presupuesto_items` (
    `id` VARCHAR(191) NOT NULL,
    `presupuestoId` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `cantidad` DECIMAL(10, 2) NOT NULL,
    `precioUnitario` DECIMAL(12, 2) NOT NULL,
    `subtotal` DECIMAL(12, 2) NOT NULL,

    INDEX `presupuesto_items_presupuestoId_fkey`(`presupuestoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pagos` (
    `id` VARCHAR(191) NOT NULL,
    `clienteId` VARCHAR(191) NOT NULL,
    `membresiaId` VARCHAR(191) NULL,
    `presupuestoId` VARCHAR(191) NULL,
    `monto` DECIMAL(12, 2) NOT NULL,
    `metodo` ENUM('EFECTIVO', 'TRANSFERENCIA', 'TARJETA', 'MERCADOPAGO') NOT NULL,
    `estado` ENUM('PENDIENTE', 'COMPLETADO', 'FALLIDO', 'REEMBOLSADO') NOT NULL DEFAULT 'PENDIENTE',
    `referencia` VARCHAR(191) NULL,
    `fechaPago` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `pagos_clienteId_idx`(`clienteId`),
    INDEX `pagos_membresiaId_fkey`(`membresiaId`),
    INDEX `pagos_presupuestoId_fkey`(`presupuestoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leads` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `zona` VARCHAR(191) NOT NULL,
    `necesidad` TEXT NOT NULL,
    `conversacion` LONGTEXT NULL,
    `estado` ENUM('NUEVO', 'CONTACTADO', 'CALIFICADO', 'CONVERTIDO', 'PERDIDO') NOT NULL DEFAULT 'NUEVO',
    `clienteId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `leads_estado_idx`(`estado`),
    INDEX `leads_telefono_idx`(`telefono`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notificaciones_whatsapp` (
    `id` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `destino` VARCHAR(191) NOT NULL,
    `mensaje` TEXT NOT NULL,
    `estado` ENUM('PENDIENTE', 'ENVIADO', 'FALLIDO') NOT NULL DEFAULT 'PENDIENTE',
    `referenciaId` VARCHAR(191) NULL,
    `error` TEXT NULL,
    `enviadoAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notificaciones_whatsapp_estado_idx`(`estado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tecnicos` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `apellido` VARCHAR(191) NOT NULL,
    `especialidad` VARCHAR(191) NULL,
    `telefono` VARCHAR(191) NULL,
    `avatar` VARCHAR(191) NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `tecnicos_activo_idx`(`activo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kb_articulos` (
    `id` VARCHAR(191) NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `contenido` TEXT NOT NULL,
    `categoria` VARCHAR(191) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `kb_articulos_categoria_idx`(`categoria`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kb_embeddings` (
    `id` VARCHAR(191) NOT NULL,
    `articuloId` VARCHAR(191) NOT NULL,
    `contenido` TEXT NOT NULL,
    `embedding` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `kb_embeddings_articuloId_fkey`(`articuloId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `configuracion` (
    `id` VARCHAR(191) NOT NULL,
    `clave` VARCHAR(191) NOT NULL,
    `valor` TEXT NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `configuracion_clave_key`(`clave`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cuentas` ADD CONSTRAINT `cuentas_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sesiones` ADD CONSTRAINT `sesiones_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `otp_requests` ADD CONSTRAINT `otp_requests_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clientes` ADD CONSTRAINT `clientes_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `membresias` ADD CONSTRAINT `membresias_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitudes` ADD CONSTRAINT `solicitudes_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitudes` ADD CONSTRAINT `solicitudes_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `servicios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `presupuestos` ADD CONSTRAINT `presupuestos_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `presupuestos` ADD CONSTRAINT `presupuestos_solicitudId_fkey` FOREIGN KEY (`solicitudId`) REFERENCES `solicitudes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `presupuesto_items` ADD CONSTRAINT `presupuesto_items_presupuestoId_fkey` FOREIGN KEY (`presupuestoId`) REFERENCES `presupuestos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pagos` ADD CONSTRAINT `pagos_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pagos` ADD CONSTRAINT `pagos_membresiaId_fkey` FOREIGN KEY (`membresiaId`) REFERENCES `membresias`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pagos` ADD CONSTRAINT `pagos_presupuestoId_fkey` FOREIGN KEY (`presupuestoId`) REFERENCES `presupuestos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kb_embeddings` ADD CONSTRAINT `kb_embeddings_articuloId_fkey` FOREIGN KEY (`articuloId`) REFERENCES `kb_articulos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
