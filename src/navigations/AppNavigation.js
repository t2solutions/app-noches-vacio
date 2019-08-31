import { createStackNavigator} from 'react-navigation';
import SignInStack from './SignInStack';
import SearchScreen from '../screens/SearchScreen';
import ShowScreen from '../screens/ShowScreen';

const RootStackNavigator = createStackNavigator(
    {
      SignInScreen: { screen: SignInStack, navigationOptions: { header: null } },
      SearchScreen: { screen: SearchScreen},
      ShowScreen: { screen: ShowScreen}
    }
);

export default RootStackNavigator;