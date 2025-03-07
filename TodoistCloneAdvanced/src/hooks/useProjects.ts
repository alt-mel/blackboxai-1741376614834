import { useState, useEffect, useCallback } from 'react';
import StorageService from '../utils/storage';
import type { Project } from '../types/Task';

const DEFAULT_COLORS = [
  '#ff6b6b', // Red
  '#4dabf7', // Blue
  '#51cf66', // Green
  '#ffd43b', // Yellow
  '#845ef7', // Purple
  '#339af0', // Light Blue
  '#20c997', // Teal
  '#ff922b', // Orange
];

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load projects
  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedProjects = await StorageService.getProjects();
      setProjects(loadedProjects);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load projects';
      setError(errorMessage);
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get random color
  const getRandomColor = () => {
    return DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];
  };

  // Add project
  const addProject = async (name: string) => {
    try {
      setError(null);
      if (!name.trim()) {
        throw new Error('Project name is required');
      }

      const now = new Date();
      const project: Project = {
        id: Date.now().toString(),
        name: name.trim(),
        color: getRandomColor(),
        createdAt: now,
        updatedAt: now,
      };

      await StorageService.saveProject(project);
      setProjects(current => [...current, project]);
      return project;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add project';
      setError(errorMessage);
      console.error('Error adding project:', err);
      return null;
    }
  };

  // Update project
  const updateProject = async (projectId: string, updates: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      setError(null);
      const projectToUpdate = projects.find(p => p.id === projectId);
      if (!projectToUpdate) {
        throw new Error('Project not found');
      }

      if (updates.name && !updates.name.trim()) {
        throw new Error('Project name cannot be empty');
      }

      const now = new Date();
      const updatedProject: Project = {
        ...projectToUpdate,
        ...updates,
        updatedAt: now,
      };

      await StorageService.updateProject(updatedProject);
      setProjects(current =>
        current.map(project => (project.id === projectId ? updatedProject : project))
      );
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update project';
      setError(errorMessage);
      console.error('Error updating project:', err);
      return false;
    }
  };

  // Delete project
  const deleteProject = async (projectId: string) => {
    try {
      setError(null);
      if (!projectId) {
        throw new Error('Project ID is required');
      }

      await StorageService.deleteProject(projectId);
      setProjects(current => current.filter(project => project.id !== projectId));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
      setError(errorMessage);
      console.error('Error deleting project:', err);
      return false;
    }
  };

  // Update project color
  const updateProjectColor = async (projectId: string, color: string) => {
    return updateProject(projectId, { color });
  };

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    updateProjectColor,
    refreshProjects: loadProjects,
  };
};

export default useProjects;
