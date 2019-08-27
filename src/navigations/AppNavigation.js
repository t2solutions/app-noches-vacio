import React from 'react';
import { createDrawerNavigator, DrawerActions, createMaterialTopTabNavigator, createStackNavigator} from 'react-navigation';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import SignInStack from './SignInStack';
import ShowStack from './ShowStack';
import SearchStack from './SearchStack';

const RootStackNavigator = createStackNavigator(
    {
      SignInStack: { screen: SignInStack, navigationOptions: { header: null } },
      SearchStack: { screen: SearchStack, navigationOptions: { header: null } },
      ShowStack: { screen: ShowStack, navigationOptions: { header: null } },
    }
);

export default RootStackNavigator;