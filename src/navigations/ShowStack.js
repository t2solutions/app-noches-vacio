import { createStackNavigator } from 'react-navigation';
import ShowScreen from '../screens/ShowScreen';

export default createStackNavigator(
  {
    ShowScreen: { screen: ShowScreen },
  }
);

