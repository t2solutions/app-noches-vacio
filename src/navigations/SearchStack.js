import { createStackNavigator } from 'react-navigation';
import SearchScreen from '../screens/SearchScreen';

export default createStackNavigator(
  {
    SearchScreen: { screen: SearchScreen },
  }
);

