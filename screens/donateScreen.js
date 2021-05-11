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

export default class DonateScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      requestedItemList: [],
    };
    this.requestRef = null;
  }
  addItem = () => {
    this.requestRef = db
      .collection("requested_items")
      .onSnapshot((snapShot) => {
        var itemsList = snapShot.docs.map((doc) => doc.data());
        this.setState({
          requestedItemList: itemsList,
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
        subtitle={item.reason_for_request}
        titleStyle={{ color: "black", fontWeight: "bold" }}
        rightElement={
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.props.navigation.navigate("ExchangerDetails", {
                details: item,
              });
            }}
          >
            <Text style={{ color: "#fff" }}>Exchange</Text>
          </TouchableOpacity>
        }
        bottomDivider
      />
    );
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="Donate Items" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.requestedItemList.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>List of all requested items</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.requestedItemList}
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
