import {RouteProp} from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
};

export type RootStackRouteProp<T extends keyof RootStackParamList> = RouteProp<RootStackParamList,T>;
