import { useState, useEffect, useCallback } from 'react';
import StorageService from '../utils/storage';
import type { Task } from '../types/Task';

export const useTasks = (projectId?: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedTasks = projectId
        ? await StorageService.getTasksByProject(projectId)
        : await StorageService.getTasks();
      setTasks(loadedTasks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tasks';
      setError(errorMessage);
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Add task
  const addTask = async (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);
      const now = new Date();
      const task: Task = {
        ...newTask,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
      };

      await StorageService.saveTask(task);
      setTasks(current => [...current, task]);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add task';
      setError(errorMessage);
      console.error('Error adding task:', err);
      return false;
    }
  };

  // Update task
  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      setError(null);
      const taskToUpdate = tasks.find(t => t.id === taskId);
      if (!taskToUpdate) {
        throw new Error('Task not found');
      }

      const now = new Date();
      const updatedTask: Task = {
        ...taskToUpdate,
        ...updates,
        updatedAt: now,
      };

      await StorageService.updateTask(updatedTask);
      setTasks(current =>
        current.map(task => (task.id === taskId ? updatedTask : task))
      );
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      console.error('Error updating task:', err);
      return false;
    }
  };

  // Delete task
  const deleteTask = async (taskId: string) => {
    try {
      setError(null);
      await StorageService.deleteTask(taskId);
      setTasks(current => current.filter(task => task.id !== taskId));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      console.error('Error deleting task:', err);
      return false;
    }
  };

  // Toggle task completion
  const toggleTaskCompletion = async (taskId: string) => {
    try {
      setError(null);
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        throw new Error('Task not found');
      }

      return await updateTask(taskId, { completed: !task.completed });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle task completion';
      setError(errorMessage);
      console.error('Error toggling task completion:', err);
      return false;
    }
  };

  // Load tasks on mount and when projectId changes
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    refreshTasks: loadTasks,
  };
};

export default useTasks;
