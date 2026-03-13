import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Task, TaskStatus } from "@/types";
import { TaskCard } from "./task-card";
import { Plus } from "lucide-react";

interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
}

const COLUMNS: { id: TaskStatus; title: string; color: string; dot: string }[] = [
  { id: "BACKLOG",     title: "Backlog",     color: "border-slate-300",  dot: "bg-slate-400"   },
  { id: "TODO",        title: "To Do",       color: "border-blue-300",   dot: "bg-blue-500"    },
  { id: "IN_PROGRESS", title: "In Progress", color: "border-amber-300",  dot: "bg-amber-500"   },
  { id: "DONE",        title: "Done",        color: "border-green-300",  dot: "bg-green-500"   },
];

export function KanbanBoard({ tasks, onTaskMove }: KanbanBoardProps) {
  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    onTaskMove(draggableId, destination.droppableId as TaskStatus);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className="flex flex-col">
              {/* Column header */}
              <div className={`flex items-center justify-between mb-3 pb-3 border-b-2 ${col.color}`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                  <h3 className="font-semibold text-slate-800 text-sm">{col.title}</h3>
                </div>
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 min-h-[160px] rounded-xl p-2.5 transition-all ${
                      snapshot.isDraggingOver
                        ? "bg-indigo-50 border-2 border-dashed border-indigo-300"
                        : "bg-slate-100/60 border-2 border-dashed border-slate-200"
                    }`}
                  >
                    <div className="space-y-3">
                      {colTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{ ...provided.draggableProps.style, opacity: snapshot.isDragging ? 0.85 : 1 }}
                              className={snapshot.isDragging ? "rotate-1 scale-105 shadow-xl" : ""}
                            >
                              <TaskCard task={task} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>

                    {colTasks.length === 0 && !snapshot.isDraggingOver && (
                      <div className="flex items-center justify-center h-20 text-slate-300 text-xs font-medium">
                        Drop tasks here
                      </div>
                    )}
                  </div>
                )}
              </Droppable>

              {col.id === "BACKLOG" && (
                <button className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 py-2 rounded-xl border border-dashed border-slate-300 hover:border-indigo-300 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Task
                </button>
              )}
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
