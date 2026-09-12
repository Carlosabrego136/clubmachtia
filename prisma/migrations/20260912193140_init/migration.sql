-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMINISTRADOR', 'PROFESOR_FACILITADOR', 'SOCIO', 'USUARIO', 'ASISTENTE_ADMINISTRATIVO');

-- CreateEnum
CREATE TYPE "Suscripcion" AS ENUM ('BASICA', 'PLUS', 'NEGOCIOS', 'NINOS', 'SOCIO_FUNDADOR', 'CREADOR_DE_CURSOS');

-- CreateEnum
CREATE TYPE "EstadoCuenta" AS ENUM ('PENDIENTE_CONFIRMACION', 'PENDIENTE_APROBACION', 'ACTIVA', 'INACTIVA', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "Lado" AS ENUM ('IZQUIERDA', 'DERECHA');

-- CreateEnum
CREATE TYPE "EstadoSlot" AS ENUM ('VACIO', 'INVITADO', 'OCUPADO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "nombreUsuario" TEXT,
    "correo" TEXT NOT NULL,
    "correoRespaldo" TEXT,
    "telefono" TEXT,
    "ladaPais" TEXT,
    "pais" TEXT,
    "estadoProvincia" TEXT,
    "ciudad" TEXT,
    "rol" "Rol" NOT NULL DEFAULT 'USUARIO',
    "suscripcion" "Suscripcion",
    "status" "EstadoCuenta" NOT NULL DEFAULT 'PENDIENTE_CONFIRMACION',
    "passwordHash" TEXT,
    "comprobantePagoUrl" TEXT,
    "tokenConfirmacion" TEXT,
    "correoConfirmado" BOOLEAN NOT NULL DEFAULT false,
    "linkInvitacion" TEXT NOT NULL,
    "invitadoPorId" TEXT,
    "padreRedId" TEXT,
    "ladoEnPadre" "Lado",
    "inactivoDesde" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlotRestringido" (
    "id" TEXT NOT NULL,
    "nivel" INTEGER NOT NULL,
    "posicion" INTEGER NOT NULL,
    "status" "EstadoSlot" NOT NULL DEFAULT 'VACIO',
    "inviteLink" TEXT,
    "usuarioId" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SlotRestringido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preregistro" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "invitadorSlug" TEXT NOT NULL,
    "tokenConfirmacion" TEXT NOT NULL,
    "confirmado" BOOLEAN NOT NULL DEFAULT false,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Preregistro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_nombreUsuario_key" ON "User"("nombreUsuario");

-- CreateIndex
CREATE UNIQUE INDEX "User_correo_key" ON "User"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "User_tokenConfirmacion_key" ON "User"("tokenConfirmacion");

-- CreateIndex
CREATE UNIQUE INDEX "User_linkInvitacion_key" ON "User"("linkInvitacion");

-- CreateIndex
CREATE INDEX "User_invitadoPorId_idx" ON "User"("invitadoPorId");

-- CreateIndex
CREATE INDEX "User_padreRedId_idx" ON "User"("padreRedId");

-- CreateIndex
CREATE UNIQUE INDEX "SlotRestringido_inviteLink_key" ON "SlotRestringido"("inviteLink");

-- CreateIndex
CREATE UNIQUE INDEX "SlotRestringido_usuarioId_key" ON "SlotRestringido"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "SlotRestringido_nivel_posicion_key" ON "SlotRestringido"("nivel", "posicion");

-- CreateIndex
CREATE UNIQUE INDEX "Preregistro_tokenConfirmacion_key" ON "Preregistro"("tokenConfirmacion");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_invitadoPorId_fkey" FOREIGN KEY ("invitadoPorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_padreRedId_fkey" FOREIGN KEY ("padreRedId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlotRestringido" ADD CONSTRAINT "SlotRestringido_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
