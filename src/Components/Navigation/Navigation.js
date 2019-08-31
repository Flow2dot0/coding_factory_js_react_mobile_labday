import { createBottomTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation';
import {Accounts} from '../Views/Accounts'
import {Expenses} from '../Views/Expenses'
import {Projects} from '../Views/Projects'
import {AccountsEdit} from '../Views/AccountsEdit'
import { ExpensesEdit } from '../Views/ExpensesEdit';
import { ProjectsEdit } from '../Views/ProjectsEdit';

const AccountStack = createStackNavigator(
    {
      Accounts: { 
        navigationOptions: () => ({
          title: "Mes comptes",
        }),
        screen: Accounts 
      },
      Settings: { 
        screen: AccountsEdit 
      }
    },
    {
      defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: '#00897B',
        },
        headerTintColor: '#FFFFFF'
      },
    }
  );

const ExpensesStack = createStackNavigator(
  {
    Expenses: { 
      navigationOptions: () => ({
        title: "Mes charges",
      }),
      screen: Expenses 
    },
    Settings: { 
      screen: ExpensesEdit 
    }
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#00897B',
      },
      headerTintColor: '#FFFFFF'
    },
  }
);

const ProjectsStack = createStackNavigator(
    {
        Projects: {
            navigationOptions: () => ({
                title: "Mes projets",
            }),
            screen: Projects
        },
        Settings: {
            screen: ProjectsEdit
        }
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#00897B',
            },
            headerTintColor: '#FFFFFF'
        },
    }
);

const TabNavigator = createBottomTabNavigator({
    Accounts: { screen: AccountStack,
                navigationOptions: {
                    title: 'Comptes'
                } },
    Expenses: { screen: ExpensesStack,
                navigationOptions: {
                    title: 'Charges'
                } },
    Projects: { screen: ProjectsStack,
                navigationOptions: {
                    title: 'Projets'
                } },
  });
  
export default createAppContainer(TabNavigator);

