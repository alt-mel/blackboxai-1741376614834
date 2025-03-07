import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Task, Project } from '../types/Task';

const TASKS_KEY = '@todoist_clone:tasks';
const PROJECTS_KEY = '@todoist_clone:projects';

export const StorageService = {
  // Task Operations
  async getTasks(): Promise<Task[]> {
    try {
      const tasksJson = await AsyncStorage.getItem(TASKS_KEY);
      if (!tasksJson) return [];
      
      const tasks = JSON.parse(tasksJson);
      // Ensure dates are properly parsed
      return tasks.map((task: Task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined
      }));
    } catch (error) {
      console.error('Error loading tasks:', error);
      throw new Error('Failed to load tasks. Please try again.');
    }
  },

  async saveTask(task: Task): Promise<boolean> {
    try {
      // Validate required fields
      if (!task.title?.trim()) {
        throw new Error('Task title is required');
      }
      if (typeof task.priority !== 'number' || task.priority < 1 || task.priority > 4) {
        throw new Error('Invalid priority level');
      }

      const tasks = await this.getTasks();
      // Check for duplicate IDs
      if (tasks.some(t => t.id === task.id)) {
        throw new Error('Task ID already exists');
      }

      const updatedTasks = [...tasks, task];
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
      return true;
    } catch (error) {
      console.error('Error saving task:', error);
      throw error instanceof Error ? error : new Error('Failed to save task');
    }
  },

  async updateTask(updatedTask: Task): Promise<boolean> {
    try {
      // Validate required fields
      if (!updatedTask.title?.trim()) {
        throw new Error('Task title is required');
      }
      if (typeof updatedTask.priority !== 'number' || updatedTask.priority < 1 || updatedTask.priority > 4) {
        throw new Error('Invalid priority level');
      }

      const tasks = await this.getTasks();
      const taskExists = tasks.some(t => t.id === updatedTask.id);
      if (!taskExists) {
        throw new Error('Task not found');
      }

      const updatedTasks = tasks.map(task => 
        task.id === updatedTask.id ? {
          ...updatedTask,
          updatedAt: new Date().toISOString()
        } : task
      );
      
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error instanceof Error ? error : new Error('Failed to update task');
    }
  },

  async deleteTask(taskId: string): Promise<boolean> {
    try {
      if (!taskId) {
        throw new Error('Task ID is required');
      }

      const tasks = await this.getTasks();
      const taskExists = tasks.some(t => t.id === taskId);
      if (!taskExists) {
        throw new Error('Task not found');
      }

      const updatedTasks = tasks.filter(task => task.id !== taskId);
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error instanceof Error ? error : new Error('Failed to delete task');
    }
  },

  // Project Operations
  async getProjects(): Promise<Project[]> {
    try {
      const projectsJson = await AsyncStorage.getItem(PROJECTS_KEY);
      if (!projectsJson) return [];
      
      const projects = JSON.parse(projectsJson);
      // Ensure dates are properly parsed
      return projects.map((project: Project) => ({
        ...project,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt)
      }));
    } catch (error) {
      console.error('Error loading projects:', error);
      throw new Error('Failed to load projects. Please try again.');
    }
  },

  async saveProject(project: Project): Promise<boolean> {
    try {
      // Validate required fields
      if (!project.name?.trim()) {
        throw new Error('Project name is required');
      }
      if (!project.color?.trim()) {
        throw new Error('Project color is required');
      }

      const projects = await this.getProjects();
      // Check for duplicate IDs
      if (projects.some(p => p.id === project.id)) {
        throw new Error('Project ID already exists');
      }

      const updatedProjects = [...projects, project];
      await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
      return true;
    } catch (error) {
      console.error('Error saving project:', error);
      throw error instanceof Error ? error : new Error('Failed to save project');
    }
  },

  async updateProject(updatedProject: Project): Promise<boolean> {
    try {
      // Validate required fields
      if (!updatedProject.name?.trim()) {
        throw new Error('Project name is required');
      }
      if (!updatedProject.color?.trim()) {
        throw new Error('Project color is required');
      }

      const projects = await this.getProjects();
      const projectExists = projects.some(p => p.id === updatedProject.id);
      if (!projectExists) {
        throw new Error('Project not found');
      }

      const updatedProjects = projects.map(project => 
        project.id === updatedProject.id ? {
          ...updatedProject,
          updatedAt: new Date().toISOString()
        } : project
      );
      
      await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
      return true;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error instanceof Error ? error : new Error('Failed to update project');
    }
  },

  async deleteProject(projectId: string): Promise<boolean> {
    try {
      if (!projectId) {
        throw new Error('Project ID is required');
      }

      const projects = await this.getProjects();
      const projectExists = projects.some(p => p.id === projectId);
      if (!projectExists) {
        throw new Error('Project not found');
      }

      // Check if there are any tasks associated with this project
      const tasks = await this.getTasks();
      const hasAssociatedTasks = tasks.some(task => task.projectId === projectId);
      if (hasAssociatedTasks) {
        throw new Error('Cannot delete project with associated tasks');
      }

      const updatedProjects = projects.filter(project => project.id !== projectId);
      await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error instanceof Error ? error : new Error('Failed to delete project');
    }
  },

  // Utility functions
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([TASKS_KEY, PROJECTS_KEY]);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw new Error('Failed to clear data. Please try again.');
    }
  },

  async getTasksByProject(projectId: string): Promise<Task[]> {
    try {
      if (!projectId) {
        throw new Error('Project ID is required');
      }

      const projects = await this.getProjects();
      const projectExists = projects.some(p => p.id === projectId);
      if (!projectExists) {
        throw new Error('Project not found');
      }

      const tasks = await this.getTasks();
      return tasks.filter(task => task.projectId === projectId);
    } catch (error) {
      console.error('Error getting tasks by project:', error);
      throw error instanceof Error ? error : new Error('Failed to get tasks by project');
    }
  },
};

export default StorageService;
