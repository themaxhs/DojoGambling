import React from 'react';
import { BottomNavigation, BottomNavigationTab, Icon, IconProps } from '@ui-kitten/components';
import { TabNavigationState } from '@react-navigation/native';
import { RootStackParamList } from '../types/RootStackParamList ';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddScreen from '../screens/AddScreen';
import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';



const { Navigator, Screen } = createBottomTabNavigator();

interface TabBarProps {
  navigation: BottomTabNavigationProp<RootStackParamList>;
  state: TabNavigationState<RootStackParamList>;
}


const HomeIcon = (props: IconProps) => (
  <Icon {...props} name='home' />
);

const ProfileIcon = (props: IconProps) => (
  <Icon {...props} name='person' />
);

const AddIcon = (props: IconProps) => (
  <Icon {...props} name='person' />
);

const TabBar: React.FC<TabBarProps> = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index] as keyof RootStackParamList)}>
    <BottomNavigationTab title="Home" icon={HomeIcon} />
    <BottomNavigationTab title="Profile" icon={ProfileIcon} />
    <BottomNavigationTab title="Add" icon={AddIcon} />
  </BottomNavigation>
);

const TabNavigator = () => (
  <Navigator tabBar={(props) => <TabBar {...props} />}>
    <Screen name="Home" component={HomeScreen} />
    <Screen name="Profile" component={ProfileScreen} />
    <Screen name="Add" component={AddScreen} />
  </Navigator>
);

export default TabNavigator;
