import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import DonateScreen from "../screens/donateScreen";
import ExchangerDetails from "../screens/exchangerDetails";

export const AppStackNavigator = createStackNavigator(
  {
    DonateList: {
      screen: DonateScreen,
      navigationOptions: {
        headerShown: false,
      },
    },

    ExchangerDetails: {
      screen: ExchangerDetails,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  { initialRouteName: "DonateList" }
);
