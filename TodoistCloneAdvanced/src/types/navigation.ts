import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

export type MainTabParamList = {
  Home: undefined;
  Projects: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  AddTask: undefined;
  TaskDetail: {
    taskId: string;
  };
  ProjectDetail: {
    projectId: string;
  };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

// Navigation prop types for use in components
export type MainTabNavigationProp = MainTabScreenProps<keyof MainTabParamList>['navigation'];
export type RootStackNavigationProp = RootStackScreenProps<keyof RootStackParamList>['navigation'];

// Route prop types for use in components
export type TaskDetailRouteProp = RootStackScreenProps<'TaskDetail'>['route'];
export type ProjectDetailRouteProp = RootStackScreenProps<'ProjectDetail'>['route'];
