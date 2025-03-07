import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';
import type { Task } from '../types/Task';
import type { MainTabNavigationProp, TaskDetailRouteProp } from '../types/navigation';
import useTasks from '../hooks/useTasks';

const TaskDetailScreen = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  const route = useRoute<TaskDetailRouteProp>();
  const { taskId } = route.params;
  const { tasks, loading, error, updateTask, deleteTask, toggleTaskCompletion } = useTasks();
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    const currentTask = tasks.find(t => t.id === taskId);
    setTask(currentTask || null);
  }, [taskId, tasks]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (task) {
              const success = await deleteTask(task.id);
              if (success) {
                navigation.goBack();
              } else {
                Alert.alert('Error', 'Failed to delete task. Please try again.');
              }
            }
          },
        },
      ],
    );
  };

  const handleToggleComplete = async () => {
    if (task) {
      const success = await toggleTaskCompletion(task.id);
      if (!success) {
        Alert.alert('Error', 'Failed to update task. Please try again.');
      }
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return '#ff0000';
      case 2:
        return '#ffa500';
      case 3:
        return '#0000ff';
      default:
        return '#808080';
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#db4c3f" />
      </View>
    );
  }

  if (error || !task) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          {error || 'Task not found'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.checkbox, task.completed && styles.checkboxChecked]}
          onPress={handleToggleComplete}
        >
          {task.completed && <Icon name="check" size={20} color="#fff" />}
        </TouchableOpacity>
        <Text style={[
          styles.title,
          task.completed && styles.titleCompleted
        ]}>
          {task.title}
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.priorityBadge}>
          <Icon
            name="flag"
            size={20}
            color={getPriorityColor(task.priority)}
          />
          <Text style={[
            styles.priorityText,
            { color: getPriorityColor(task.priority) }
          ]}>
            Priority {task.priority}
          </Text>
        </View>
      </View>

      {task.description && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{task.description}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Created</Text>
        <Text style={styles.dateText}>
          {format(new Date(task.createdAt), 'PPP')}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Last Updated</Text>
        <Text style={styles.dateText}>
          {format(new Date(task.updatedAt), 'PPP')}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
      >
        <Icon name="trash-can-outline" size={20} color="#fff" />
        <Text style={styles.deleteButtonText}>Delete Task</Text>
      </TouchableOpacity>
    </ScrollView>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#db4c3f',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#db4c3f',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#808080',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 16,
    color: '#666',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4444',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
  },
});

export default TaskDetailScreen;
