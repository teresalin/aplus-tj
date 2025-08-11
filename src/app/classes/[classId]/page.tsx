import ClassComponent from "@/components/Class";
import React from "react";

export default async function Page({
  params,
}: {
  params: { classId: string };
}) {
  const { classId } = params;

  const classData = await getClass(classId);

  if (!classData) {
    return <div>Class not found</div>;
  }
  return <ClassComponent classId={classId} initialState={class} />;
}
