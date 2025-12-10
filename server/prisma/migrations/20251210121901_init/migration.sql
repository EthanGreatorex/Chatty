-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" SERIAL NOT NULL,
    "fromUID" INTEGER NOT NULL,
    "toUID" INTEGER NOT NULL,
    "messageText" TEXT NOT NULL,
    "sentDt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readStatus" TEXT NOT NULL DEFAULT 'Unread',

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_fromUID_fkey" FOREIGN KEY ("fromUID") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_toUID_fkey" FOREIGN KEY ("toUID") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
