-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL DEFAULT ('card_'::text || nanoid()),
    "code" TEXT NOT NULL,
    "rarity" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cost" INTEGER,
    "attribute" TEXT NOT NULL,
    "power" INTEGER,
    "counter" INTEGER,
    "color" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "effect" TEXT,
    "set" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Card_uid_key" ON "Card"("uid");
