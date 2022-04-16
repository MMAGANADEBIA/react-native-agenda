import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Home from '../screens/home.js';
import AddContact from '../screens/addContact.js';


const screens = {
  Home: {
    screen: Home,
    navigationOptions: {
      headerShown: false,
    }
  },
  addContact: {
    screen: AddContact,
    navigationOptions: {
      headerShown: false,
    }
  }
}

const HomeStack = createStackNavigator(screens)

export default createAppContainer(HomeStack);
