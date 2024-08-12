import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDndContext, type UniqueIdentifier } from "@dnd-kit/core";
import { TaskCard } from "./TaskCard";
import { useMemo } from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export interface Column {
  id: UniqueIdentifier;
  title: string;
}

export type ColumnType = "Column";

export interface ColumnDragData {
  type: ColumnType;
  column: Column;
}

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  isOverlay?: boolean;
}

export default function ColumnBoard({ column, tasks, isOverlay }: BoardColumnProps) {
  
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.title}`,
    },
  });

  return (
    <div 
      className="grid gap-4 md:col-span-1"
      ref={setNodeRef}
    >
      <Card>
        <CardHeader>
          <CardTitle>{column.title}</CardTitle>
        </CardHeader>
        <ScrollArea>
          <CardContent className="grid gap-4">
            <SortableContext items={tasksIds}>
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </SortableContext>
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  )
}