import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { Project } from '../types/Task';
import type { MainTabNavigationProp } from '../types/navigation';
import useProjects from '../hooks/useProjects';
import useTasks from '../hooks/useTasks';

const ProjectScreen = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  const { projects, loading, error, addProject, deleteProject } = useProjects();
  const { tasks } = useTasks();

  const getProjectTaskCount = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId).length;
  };

  const handleAddProject = () => {
    Alert.prompt(
      'New Project',
      'Enter project name',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Create',
          onPress: async (name?: string) => {
            if (name?.trim()) {
              const project = await addProject(name.trim());
              if (!project) {
                Alert.alert('Error', 'Failed to create project. Please try again.');
              }
            }
          },
        },
      ],
      'plain-text',
    );
  };

  const handleDeleteProject = (project: Project) => {
    const taskCount = getProjectTaskCount(project.id);
    
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${project.name}"? ${
        taskCount > 0 ? `This will also delete ${taskCount} task${taskCount === 1 ? '' : 's'}.` : ''
      }`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteProject(project.id);
            if (!success) {
              Alert.alert('Error', 'Failed to delete project. Please try again.');
            }
          },
        },
      ],
    );
  };

  const renderProject = ({ item }: { item: Project }) => (
    <TouchableOpacity 
      style={styles.projectItem}
      onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}
    >
      <View style={[styles.projectColor, { backgroundColor: item.color }]} />
      <View style={styles.projectInfo}>
        <Text style={styles.projectName}>{item.name}</Text>
        <Text style={styles.projectTaskCount}>
          {getProjectTaskCount(item.id)} tasks
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleDeleteProject(item)}
        style={styles.deleteButton}
      >
        <Icon name="trash-can-outline" size={20} color="#999" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#db4c3f" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {projects.length === 0 ? (
        <View style={styles.centerContainer}>
          <Icon name="folder-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No projects yet</Text>
          <Text style={styles.emptySubText}>Add a project to organize your tasks</Text>
        </View>
      ) : (
        <FlatList
          data={projects}
          renderItem={renderProject}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddProject}
      >
        <Icon name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  list: {
    flex: 1,
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  projectColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  projectTaskCount: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#db4c3f',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
  },
});

export default ProjectScreen;
