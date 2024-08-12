import { Task } from "@/components/TaskCard";
import KanbanBoard from "@/components/KanbanBoard";
import { Column } from "@/components/ColumnBoard";
import Modal from "@/components/TaskModal";
import { useEffect } from "react";

type SearchParamProps = {
  searchParams: Record<string, string> | null | undefined;
};


export const defaultCols = [
  {
    id: "todo" as const,
    title: "Todo",
  },
  {
    id: "in-progress" as const,
    title: "In progress",
  },
  {
    id: "done" as const,
    title: "Done",
  },
] satisfies Column[];

async function getData() {
  const res = await fetch('http://localhost:8000/tasks/user/72a4fafa-901c-48de-a0e2-501adaf218a0',{
    cache: 'no-store'
  })
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}

export default async function Home({ searchParams }: SearchParamProps) {
  const data = await getData();
  const show = searchParams?.show;
  const taskId = searchParams?.task;

  return (
    <main className="flex w-full flex-1 items-start justify-center gap-4 p-4 sm:p-6 md:grid md:grid-cols-3 md:gap-6">
      <KanbanBoard defaultCols={defaultCols} initialTasks={data}/>
      {show && <Modal task={taskId}/>}
    </main>
  );
}