export type Priority = "HIGH" | "MEDIUM" | "LOW";
export type TaskStatus = "BACKLOG" | "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string;
  title: string;
  team: string;
  priority: Priority;
  assignee: string;
  dependentOn?: string;
  recommendation?: string;
  status: TaskStatus;
}

export interface Decision {
  id: string;
  text: string;
}

export interface TranscriptLine {
  id: string;
  speaker: string;
  text: string;
  time: string;
}
