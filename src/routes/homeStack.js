import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Home from '../screens/home.js';
import AddContact from '../screens/addContact.js';
import UpdateContact from '../screens/updateContact.js';

const screens = {
  Home: {
    screen: Home,
    navigationOptions: {
      headerShown: false,
      animations: {
        push: {
          waitForRender: true,
        },
      },
    },
    colors: {
      background: '#14191f'
    },
  },
  addContact: {
    screen: AddContact,
    navigationOptions: {
      headerShown: false,
      animations: {
        push: {
          waitForRender: true,
        }
      }
    },
    colors: {
      background: '#14191f'
    },
  },
  updateContact: {
    screen: UpdateContact,
    navigationOptions: {
      headerShown: false,
      animations: {
        push: {
          waitForRender: true,
        }
      }
    },
    colors: {
      background: '#14191f'
    },
  },
}

const HomeStack = createStackNavigator(screens)

export default createAppContainer(HomeStack);
