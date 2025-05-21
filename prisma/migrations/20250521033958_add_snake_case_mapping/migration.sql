/*
  Warnings:

  - You are about to drop the column `created` on the `assignment` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `assignment` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `assignment` table. All the data in the column will be lost.
  - You are about to drop the column `created` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `attendance` table. All the data in the column will be lost.
  - You are about to drop the column `created` on the `billing_category` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `billing_category` table. All the data in the column will be lost.
  - You are about to drop the column `created` on the `class` table. All the data in the column will be lost.
  - You are about to drop the column `gradeId` on the `class` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `class` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `class` table. All the data in the column will be lost.
  - You are about to drop the column `assignmentId` on the `class_assignment` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `class_assignment` table. All the data in the column will be lost.
  - You are about to drop the column `created` on the `class_assignment` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `class_assignment` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `class_cost` table. All the data in the column will be lost.
  - You are about to drop the column `created` on the `class_cost` table. All the data in the column will be lost.
  - You are about to drop the column `effectiveDate` on the `class_cost` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `class_cost` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `class_student` table. All the data in the column will be lost.
  - You are about to drop the column `created` on the `class_student` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `class_student` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `class_student` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `class_student` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `class_student` table. All the data in the column will be lost.
  - You are about to drop the column `created` on the `grade` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `grade` table. All the data in the column will be lost.
  - You are about to drop the column `created` on the `holiday` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `holiday` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `holiday` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `holiday` table. All the data in the column will be lost.
  - You are about to drop the column `created` on the `parent` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `parent` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `parent` table. All the data in the column will be lost.
  - You are about to drop the column `created` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `person` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `created` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `dayOfWeek` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `classId` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `created` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `created` on the `session_date_history` table. All the data in the column will be lost.
  - You are about to drop the column `modificationReason` on the `session_date_history` table. All the data in the column will be lost.
  - You are about to drop the column `modifiedAt` on the `session_date_history` table. All the data in the column will be lost.
  - You are about to drop the column `newDate` on the `session_date_history` table. All the data in the column will be lost.
  - You are about to drop the column `oldDate` on the `session_date_history` table. All the data in the column will be lost.
  - You are about to drop the column `sessionId` on the `session_date_history` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `session_date_history` table. All the data in the column will be lost.
  - You are about to drop the column `created` on the `staff` table. All the data in the column will be lost.
  - You are about to drop the column `hireDate` on the `staff` table. All the data in the column will be lost.
  - You are about to drop the column `leaveDate` on the `staff` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `staff` table. All the data in the column will be lost.
  - You are about to drop the column `staffId` on the `staff` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `staff` table. All the data in the column will be lost.
  - You are about to drop the column `created` on the `staff_role` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `staff_role` table. All the data in the column will be lost.
  - You are about to drop the column `admissionDate` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `created` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `currentSchool` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `departureDate` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `gradeId` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `textbookPublisher` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `billingRecordId` on the `student_billing_detail` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `student_billing_detail` table. All the data in the column will be lost.
  - You are about to drop the column `created` on the `student_billing_detail` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `student_billing_detail` table. All the data in the column will be lost.
  - You are about to drop the column `billingDate` on the `student_billing_record` table. All the data in the column will be lost.
  - You are about to drop the column `created` on the `student_billing_record` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceNumber` on the `student_billing_record` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `student_billing_record` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `student_billing_record` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `student_billing_record` table. All the data in the column will be lost.
  - You are about to drop the column `accountNumber` on the `student_payment_method` table. All the data in the column will be lost.
  - You are about to drop the column `billingAddress` on the `student_payment_method` table. All the data in the column will be lost.
  - You are about to drop the column `created` on the `student_payment_method` table. All the data in the column will be lost.
  - You are about to drop the column `expirationDate` on the `student_payment_method` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `student_payment_method` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `student_payment_method` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `student_payment_method` table. All the data in the column will be lost.
  - You are about to drop the column `created` on the `user_identifier` table. All the data in the column will be lost.
  - You are about to drop the column `isSocialMedia` on the `user_identifier` table. All the data in the column will be lost.
  - You are about to drop the column `personId` on the `user_identifier` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `user_identifier` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[parent_id]` on the table `parent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[class_id,start_time,end_time]` on the table `session` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[staff_id]` on the table `staff` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[student_id]` on the table `student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_id` to the `attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `billing_category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grade_id` to the `class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacher_id` to the `class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignment_id` to the `class_assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_id` to the `class_assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `class_assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_id` to the `class_cost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `class_cost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_id` to the `class_student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `class_student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `class_student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `class_student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `grade` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_date` to the `holiday` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `holiday` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `holiday` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `parent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_id` to the `schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `day_of_week` to the `schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_id` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `new_date` to the `session_date_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `old_date` to the `session_date_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `session_id` to the `session_date_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `session_date_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hire_date` to the `staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `staff_role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admission_date` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grade_id` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billing_record_id` to the `student_billing_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `student_billing_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `student_billing_record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `student_billing_record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `student_payment_method` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `student_payment_method` table without a default value. This is not possible if the table is not empty.
  - Added the required column `person_id` to the `user_identifier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `user_identifier` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_studentId_fkey";

-- DropForeignKey
ALTER TABLE "class" DROP CONSTRAINT "class_gradeId_fkey";

-- DropForeignKey
ALTER TABLE "class" DROP CONSTRAINT "class_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "class_assignment" DROP CONSTRAINT "class_assignment_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "class_assignment" DROP CONSTRAINT "class_assignment_classId_fkey";

-- DropForeignKey
ALTER TABLE "class_cost" DROP CONSTRAINT "class_cost_classId_fkey";

-- DropForeignKey
ALTER TABLE "class_student" DROP CONSTRAINT "class_student_classId_fkey";

-- DropForeignKey
ALTER TABLE "class_student" DROP CONSTRAINT "class_student_studentId_fkey";

-- DropForeignKey
ALTER TABLE "schedule" DROP CONSTRAINT "schedule_classId_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_classId_fkey";

-- DropForeignKey
ALTER TABLE "session_date_history" DROP CONSTRAINT "session_date_history_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "staff" DROP CONSTRAINT "staff_roleId_fkey";

-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_gradeId_fkey";

-- DropForeignKey
ALTER TABLE "student_billing_detail" DROP CONSTRAINT "student_billing_detail_billingRecordId_fkey";

-- DropForeignKey
ALTER TABLE "student_billing_detail" DROP CONSTRAINT "student_billing_detail_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "student_billing_record" DROP CONSTRAINT "student_billing_record_studentId_fkey";

-- DropForeignKey
ALTER TABLE "student_payment_method" DROP CONSTRAINT "student_payment_method_studentId_fkey";

-- DropForeignKey
ALTER TABLE "user_identifier" DROP CONSTRAINT "user_identifier_personId_fkey";

-- DropIndex
DROP INDEX "parent_parentId_key";

-- DropIndex
DROP INDEX "session_classId_startTime_endTime_key";

-- DropIndex
DROP INDEX "staff_staffId_key";

-- DropIndex
DROP INDEX "student_studentId_key";

-- AlterTable
ALTER TABLE "assignment" DROP COLUMN "created",
DROP COLUMN "dueDate",
DROP COLUMN "updated",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "due_date" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "attendance" DROP COLUMN "created",
DROP COLUMN "sessionId",
DROP COLUMN "studentId",
DROP COLUMN "updated",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "session_id" TEXT NOT NULL,
ADD COLUMN     "student_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "billing_category" DROP COLUMN "created",
DROP COLUMN "updated",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "class" DROP COLUMN "created",
DROP COLUMN "gradeId",
DROP COLUMN "teacherId",
DROP COLUMN "updated",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "grade_id" TEXT NOT NULL,
ADD COLUMN     "teacher_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "class_assignment" DROP COLUMN "assignmentId",
DROP COLUMN "classId",
DROP COLUMN "created",
DROP COLUMN "updated",
ADD COLUMN     "assignment_id" TEXT NOT NULL,
ADD COLUMN     "class_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "class_cost" DROP COLUMN "classId",
DROP COLUMN "created",
DROP COLUMN "effectiveDate",
DROP COLUMN "updated",
ADD COLUMN     "class_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "effective_date" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "class_student" DROP COLUMN "classId",
DROP COLUMN "created",
DROP COLUMN "endDate",
DROP COLUMN "startDate",
DROP COLUMN "studentId",
DROP COLUMN "updated",
ADD COLUMN     "class_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "student_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "grade" DROP COLUMN "created",
DROP COLUMN "updated",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "holiday" DROP COLUMN "created",
DROP COLUMN "endDate",
DROP COLUMN "startDate",
DROP COLUMN "updated",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "end_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "parent" DROP COLUMN "created",
DROP COLUMN "parentId",
DROP COLUMN "updated",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "parent_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "person" DROP COLUMN "created",
DROP COLUMN "updated",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "schedule" DROP COLUMN "classId",
DROP COLUMN "created",
DROP COLUMN "dayOfWeek",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
DROP COLUMN "updated",
ADD COLUMN     "class_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "day_of_week" "day_of_week" NOT NULL,
ADD COLUMN     "end_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "session" DROP COLUMN "classId",
DROP COLUMN "created",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
DROP COLUMN "updated",
ADD COLUMN     "class_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "end_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "session_date_history" DROP COLUMN "created",
DROP COLUMN "modificationReason",
DROP COLUMN "modifiedAt",
DROP COLUMN "newDate",
DROP COLUMN "oldDate",
DROP COLUMN "sessionId",
DROP COLUMN "updated",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "modification_reason" TEXT,
ADD COLUMN     "modified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "new_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "old_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "session_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "staff" DROP COLUMN "created",
DROP COLUMN "hireDate",
DROP COLUMN "leaveDate",
DROP COLUMN "roleId",
DROP COLUMN "staffId",
DROP COLUMN "updated",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "hire_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "leave_date" TIMESTAMP(3),
ADD COLUMN     "role_id" TEXT NOT NULL,
ADD COLUMN     "staff_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "staff_role" DROP COLUMN "created",
DROP COLUMN "updated",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "student" DROP COLUMN "admissionDate",
DROP COLUMN "created",
DROP COLUMN "currentSchool",
DROP COLUMN "departureDate",
DROP COLUMN "gradeId",
DROP COLUMN "studentId",
DROP COLUMN "textbookPublisher",
DROP COLUMN "updated",
ADD COLUMN     "admission_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "current_school" TEXT,
ADD COLUMN     "departure_date" TIMESTAMP(3),
ADD COLUMN     "grade_id" TEXT NOT NULL,
ADD COLUMN     "student_id" TEXT,
ADD COLUMN     "textbook_publisher" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "student_billing_detail" DROP COLUMN "billingRecordId",
DROP COLUMN "categoryId",
DROP COLUMN "created",
DROP COLUMN "updated",
ADD COLUMN     "billing_record_id" TEXT NOT NULL,
ADD COLUMN     "category_id" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "student_billing_record" DROP COLUMN "billingDate",
DROP COLUMN "created",
DROP COLUMN "invoiceNumber",
DROP COLUMN "paymentMethod",
DROP COLUMN "studentId",
DROP COLUMN "updated",
ADD COLUMN     "billing_date" TIMESTAMP(3),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "invoice_number" TEXT,
ADD COLUMN     "payment_method" TEXT,
ADD COLUMN     "student_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "student_payment_method" DROP COLUMN "accountNumber",
DROP COLUMN "billingAddress",
DROP COLUMN "created",
DROP COLUMN "expirationDate",
DROP COLUMN "paymentMethod",
DROP COLUMN "studentId",
DROP COLUMN "updated",
ADD COLUMN     "account_number" TEXT,
ADD COLUMN     "billing_address" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiration_date" TIMESTAMP(3),
ADD COLUMN     "payment_method" TEXT,
ADD COLUMN     "student_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "user_identifier" DROP COLUMN "created",
DROP COLUMN "isSocialMedia",
DROP COLUMN "personId",
DROP COLUMN "updated",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_social_media" BOOLEAN,
ADD COLUMN     "person_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "parent_parent_id_key" ON "parent"("parent_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_class_id_start_time_end_time_key" ON "session"("class_id", "start_time", "end_time");

-- CreateIndex
CREATE UNIQUE INDEX "staff_staff_id_key" ON "staff"("staff_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_student_id_key" ON "student"("student_id");

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "staff_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_identifier" ADD CONSTRAINT "user_identifier_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_cost" ADD CONSTRAINT "class_cost_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_student" ADD CONSTRAINT "class_student_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_student" ADD CONSTRAINT "class_student_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_date_history" ADD CONSTRAINT "session_date_history_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_assignment" ADD CONSTRAINT "class_assignment_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_assignment" ADD CONSTRAINT "class_assignment_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "schedule_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_billing_record" ADD CONSTRAINT "student_billing_record_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_billing_detail" ADD CONSTRAINT "student_billing_detail_billing_record_id_fkey" FOREIGN KEY ("billing_record_id") REFERENCES "student_billing_record"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_billing_detail" ADD CONSTRAINT "student_billing_detail_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "billing_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_payment_method" ADD CONSTRAINT "student_payment_method_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
