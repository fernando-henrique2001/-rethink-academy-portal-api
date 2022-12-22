-- CreateEnum
CREATE TYPE "Main" AS ENUM ('ENGINEERING', 'DESIGN', 'PRODUCT', 'ALL');

-- CreateEnum
CREATE TYPE "CourseStyle" AS ENUM ('COURSE', 'WORKSHOP', 'TRAINING', 'LECTURE');

-- CreateEnum
CREATE TYPE "Titles" AS ENUM ('ENGINEERING', 'DESIGN', 'PRODUCT');

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('STUDENT', 'AMBASSADOR', 'RETHINKER');

-- CreateEnum
CREATE TYPE "Levels" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "surname" TEXT,
    "role" "Roles" DEFAULT 'STUDENT',
    "main" "Titles" DEFAULT 'ENGINEERING',
    "avatar" TEXT NOT NULL,
    "watched" TEXT[],
    "cratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receiveGIF" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categories" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "info" (
    "id" TEXT NOT NULL,
    "college" TEXT,
    "semester" TEXT,
    "workTime" TEXT,
    "transportationVoucher" TEXT,
    "providedEquipment" TEXT,
    "status" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "product" TEXT[],
    "engineering" TEXT[],
    "academy" TEXT[],
    "design" TEXT[],
    "welcome" TEXT[],
    "studies" TEXT[],
    "timeRecord" TEXT[],
    "troll" TEXT[],
    "goals" TEXT[],

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goalList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "goalList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "conclude" BOOLEAN NOT NULL,
    "goalListId" TEXT NOT NULL,

    CONSTRAINT "goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monthEvaluate" (
    "id" TEXT NOT NULL,
    "skillType" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "skill1" INTEGER NOT NULL,
    "skill2" INTEGER NOT NULL,
    "skill3" INTEGER NOT NULL,
    "skill4" INTEGER NOT NULL,
    "skill5" INTEGER NOT NULL,
    "skill6" INTEGER NOT NULL,

    CONSTRAINT "monthEvaluate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bucket" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Bucket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trail" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "main" "Main" NOT NULL DEFAULT 'ENGINEERING',
    "cratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "level" "Levels" NOT NULL,
    "workload" INTEGER NOT NULL,
    "learning" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "courseStyle" "CourseStyle" NOT NULL DEFAULT 'COURSE',
    "imageTeacher" TEXT NOT NULL,
    "teacherDescription" TEXT NOT NULL,
    "teacherName" TEXT NOT NULL,
    "trailId" TEXT NOT NULL,
    "cratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lesson" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "embedUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "cratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "module" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "cratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline" (
    "id" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "finish" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "trailId" TEXT NOT NULL,
    "cratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "taskDate" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT 'tags',
    "status" TEXT NOT NULL DEFAULT 'status',
    "description" TEXT NOT NULL DEFAULT 'description',
    "userId" TEXT NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "CommmentAuthorId" TEXT,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stickerNotes" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "data" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "priority" INTEGER DEFAULT 3,
    "userId" TEXT NOT NULL,

    CONSTRAINT "stickerNotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "info_userId_key" ON "info"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "badges_userId_key" ON "badges"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Bucket_userId_key" ON "Bucket"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "trail_name_key" ON "trail"("name");

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "info" ADD CONSTRAINT "info_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "badges" ADD CONSTRAINT "badges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goalList" ADD CONSTRAINT "goalList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal" ADD CONSTRAINT "goal_goalListId_fkey" FOREIGN KEY ("goalListId") REFERENCES "goalList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monthEvaluate" ADD CONSTRAINT "monthEvaluate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bucket" ADD CONSTRAINT "Bucket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_trailId_fkey" FOREIGN KEY ("trailId") REFERENCES "trail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lesson" ADD CONSTRAINT "lesson_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module" ADD CONSTRAINT "module_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline" ADD CONSTRAINT "timeline_trailId_fkey" FOREIGN KEY ("trailId") REFERENCES "trail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_CommmentAuthorId_fkey" FOREIGN KEY ("CommmentAuthorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stickerNotes" ADD CONSTRAINT "stickerNotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
