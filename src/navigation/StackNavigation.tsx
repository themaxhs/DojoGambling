import React from 'react';
import { BottomNavigation, BottomNavigationTab, Icon, IconProps } from '@ui-kitten/components';
import { NavigationHelpers, TabNavigationState } from '@react-navigation/native';
import { RootStackParamList, RootStackRouteProp } from '../types/RootStackParamList ';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const { Navigator, Screen } = createBottomTabNavigator();

interface TabBarProps {
  navigation: NavigationHelpers<RootStackParamList>;
  state: TabNavigationState<RootStackParamList>;
}

const HomeIcon = (props: IconProps) => (
  <Icon {...props} name='home' />
);

const ProfileIcon = (props: IconProps) => (
  <Icon {...props} name='person' />
);

const TabBar: React.FC<TabBarProps> = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index] as keyof RootStackParamList)}>
    <BottomNavigationTab title="Home" icon={HomeIcon} />
    <BottomNavigationTab title="Profile" icon={ProfileIcon} />
  </BottomNavigation>
);

const TabNavigator = () => (
  <Navigator tabBar={(props) => <TabBar {...props} />}>
    <Screen name="Home" component={HomeScreen} />
    <Screen name="Profile" component={ProfileScreen} />
  </Navigator>
);

export default TabNavigator;
