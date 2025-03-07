export type Priority = 1 | 2 | 3 | 4; // 1 is highest, 4 is lowest

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  priority: Priority;
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  dueDate?: Date;
  priority: Priority;
  projectId?: string;
}

export interface UpdateTaskDTO {
  id: string;
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: Date | null;
  priority?: Priority;
  projectId?: string | null;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProjectDTO {
  name: string;
  color: string;
}

export interface UpdateProjectDTO {
  id: string;
  name?: string;
  color?: string;
}
