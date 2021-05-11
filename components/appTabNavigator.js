import React from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "react-navigation-tabs";
import DonateScreen from "../screens/donateScreen";
import RequestScreen from "../screens/requestScreen";
import { AppStackNavigator } from "./appStackNavigator";

export const AppTabNavigator = createBottomTabNavigator({
  Donate: {
    screen: AppStackNavigator,
    navigationOptions: {
      tabBarIcon: (
        <Image
          style={{ width: 20, height: 20 }}
          source={require("../assets/donateIcon.png")}
        />
      ),
      tabBarLabel: "Donate",
    },
  },

  Request: {
    screen: RequestScreen,
    navigationOptions: {
      tabBarIcon: (
        <Image
          style={{ width: 20, height: 20 }}
          source={require("../assets/requestIcon.png")}
        />
      ),
      tabBarLabel: "Request",
    },
  },
});
