-- Add contentId to Task
ALTER TABLE "Task" ADD COLUMN "contentId" TEXT;

-- Add unique constraint on DailyContent(date, type)
CREATE UNIQUE INDEX "DailyContent_date_type_key" ON "DailyContent"("date", "type");

-- Add unique constraint on Task(date, contentId)
CREATE UNIQUE INDEX "Task_date_contentId_key" ON "Task"("date", "contentId");
