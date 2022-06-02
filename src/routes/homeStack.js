//Imports of the modules necessary to create routes.
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
//Imports of the screens.
import Home from '../screens/home.js';
import AddContact from '../screens/addContact.js';
import UpdateContact from '../screens/updateContact.js';

//Variable with the modules to charge and their configurations.
//Order of how the screens going to be shown.
const screens = {
  //First, name of the component.
  Home: {
    //Value of the component. The screen to charge.
    screen: Home,
    //Options of screen.
    navigationOptions: {
      //The header of the screen with title and back arrow is not shown.
      headerShown: false,
    },
  },
  addContact: {
    screen: AddContact,
    navigationOptions: {
      headerShown: false,
    },
  },
  updateContact: {
    screen: UpdateContact,
    navigationOptions: {
      headerShown: false,
    },
  },
}

//Creates the navigation stack screens.
const HomeStack = createStackNavigator(screens)

export default createAppContainer(HomeStack);
