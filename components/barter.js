import React from "react";
import LottieView from "lottie-react-native";

export default class BarterAnimation extends React.Component {
  render() {
    return (
      <LottieView
        source={require("../assets/31821-share-everythin-moneybooks.json")}
        autoPlay
        loop
        style={{width: '60%'}}
      />
    );
  }
}