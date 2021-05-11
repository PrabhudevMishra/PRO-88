import React from "react";
import LoginSignUpScreen from "./screens/loginSignUpScreen";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { AppDrawerNavigator } from "./components/appDrawerNavigator";

export default function App() {
  return <AppContainer />;
}

const switchNaviagtor = createSwitchNavigator({
  LoginSignUpScreen: { screen: LoginSignUpScreen },
  Drawer: { screen: AppDrawerNavigator },
});

const AppContainer = createAppContainer(switchNaviagtor);