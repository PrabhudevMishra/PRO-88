import React from "react";
import { createDrawerNavigator } from "react-navigation-drawer";
import { AppTabNavigator } from "./appTabNavigator";
import CustomSidebarMenu from "./customSidebarMenu";
import SettingScreen from "../screens/settingsScreen";
import MyBarters from "../screens/myBarters";
import Notification from "../screens/notificationsScreen";
import MyReceivedItems from "../screens/myReceivedItemScreen";
import { Icon } from "react-native-elements";

export const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: { screen: AppTabNavigator },
    MyBarters: { screen: MyBarters },
    Notification: { screen: Notification },
    Settings: { screen: SettingScreen },
    ReceivedItems: {
      screen: MyReceivedItems,
      navigationOptions: {
        drawerIcon: <Icon 
          name = 'notification'
          type = 'entypo'
          color = '#000'
        />,
        drawerLabel: 'My Received Items'
      },
    },
  },
  {
    contentComponent: CustomSidebarMenu,
  },
  {
    initialRouteName: "Home",
  }
);
