import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";

import { CalendarIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { GripVertical } from "lucide-react";
import { Badge } from "./ui/badge";
import Link from "next/link";

export interface Task {
  id: UniqueIdentifier;
  status: any;
  content: string;
  title: string;
  description: string;
}

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export function TaskCard({ task, isOverlay }: TaskCardProps) {

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: "Task",
    },
  });

  return (
    <Card 
      ref={setNodeRef}
    >
      <CardHeader className="px-3 py-3 space-between flex flex-row border-b-2 border-secondary relative">
        <Button
          variant={"ghost"}
          {...attributes}
          {...listeners}
          className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
        >
          <span className="sr-only">Move task</span>
          <GripVertical />
        </Button>
        <Button variant={"outline"} size={`sm`} className="ml-auto font-semibold">
          <Link href={`/?show=true&task=${task.id}`}>
            Edit
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium">{ task.title }</h3>
        <p className="text-sm text-muted-foreground">
          { task.description }
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>OC</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">Oscar Corcho</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">1 week ago</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}