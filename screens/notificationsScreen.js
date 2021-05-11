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
import { ListItem, Icon } from "react-native-elements";
import SwipeableFlatlist from "../components/swipeableFlatlist";

export default class Notification extends React.Component {
  constructor() {
    super();
    this.state = {
      allNotifications: [],
      userId: firebase.auth().currentUser.email,
    };
    this.requestRef = null;
  }
  getAllNotifications = () => {
    this.requestRef = db
      .collection("all_notifications")
      .where("targeted_user_id", "==", this.state.userId)
      .where("notification_status", "==", "unread")
      .onSnapshot((snapShot) => {
        var allNotificationsList = [];
        snapShot.docs.map((doc) => {
          var notifications = doc.data();
          notifications["doc_id"] = doc.id;
          allNotificationsList.push(notifications);
        });
        this.setState({
          allNotifications: allNotificationsList,
        });
      });
  };

  componentDidMount() {
    this.getAllNotifications();
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
        subtitle={item.message}
        titleStyle={{ color: "black", fontWeight: "bold" }}
        leftElement={
          <Icon
            name="notification"
            type="entypo"
            color="#f2f50f"
          />
        }
        bottomDivider
      />
    );
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="My Notifications" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.allNotifications.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>You have no notifications</Text>
            </View>
          ) : (
            <SwipeableFlatlist allNotifications={this.state.allNotifications} />
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
