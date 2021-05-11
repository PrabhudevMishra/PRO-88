import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import MyHeader from "../components/myHeader";
import { ListItem } from "react-native-elements";

export default class MyReceivedItems extends React.Component {
  constructor() {
    super();
    this.state = {
      receivedItemList: [],
      userId: firebase.auth().currentUser.email,
    };
    this.requestRef = null;
  }
  addItem = () => {
    this.requestRef = db
      .collection("requested_items")
      .where("item_status", "==", "received")
      .where("user_id", "==", this.state.userId)
      .onSnapshot((snapShot) => {
        var itemsList = snapShot.docs.map((doc) => doc.data());
        this.setState({
          receivedItemList: itemsList,
        });
      });
  };
  componentDidMount() {
    this.addItem();
  }

  componentWillUnmount() {
    this.requestRef();
  }
  keyExtractor = (item, index) => index.toString();
  renderItem = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        title={item.items_name}
        titleStyle={{ color: "black", fontWeight: "bold" }}
      />
    );
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="My Received Items" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.receivedItemList.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>You have not received items</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.receivedItemList}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
  },
});
