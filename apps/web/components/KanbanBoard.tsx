'use client'

import Image from "next/image";
import { useDndContext, type UniqueIdentifier, DndContext, type DragStartEvent, type DragEndEvent, type DragOverEvent, DragOverlay } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { Task, TaskCard } from "./TaskCard";
import { hasDraggableData } from "@/lib/utils";
import { createPortal } from "react-dom";
import ColumnBoard, { Column } from "./ColumnBoard";

export interface KanbanProps {
  defaultCols: Column[];
  initialTasks: { tasks: Task[] };
}

export default function KanbanBoard({ defaultCols, initialTasks }: KanbanProps) {

  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [tasks, setTasks] = useState<Task[]>(initialTasks.tasks);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === "Column") {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === "Task") {
      setActiveTask(data.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    if (activeId === overId) return;

    const isActiveAColumn = activeData?.type === "Column";
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveATask = activeData?.type === "Task";
    const isOverATask = overData?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        const activeTask = tasks[activeIndex];
        const overTask = tasks[overIndex];
        if (
          activeTask &&
          overTask &&
          activeTask.status !== overTask.status
        ) {
          activeTask.status = overTask.status;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = overData?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const activeTask = tasks[activeIndex];
        if (activeTask) {
          activeTask.status = overId as any;
          return arrayMove(tasks, activeIndex, activeIndex);
        }
        return tasks;
      });
    }
  }

  return (
    <DndContext  
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <SortableContext items={columnsId}>
            {columns.map((col) => (
              <ColumnBoard
                key={col.id}
                column={col}
                tasks={tasks?.filter((task) => task?.status === col.id)}
              />
            ))}
        </SortableContext>

        { typeof window !== "undefined" && (
          "document" in window &&
            createPortal(
              <DragOverlay>
                {activeColumn && (
                  <ColumnBoard
                    isOverlay
                    column={activeColumn}
                    tasks={tasks.filter(
                      (task) => task.columnId === activeColumn.id
                    )}
                  />
                )}
                {activeTask && <TaskCard task={activeTask} isOverlay />}
              </DragOverlay>,
              document.body
            )
        ) }

      </DndContext>
  )
}