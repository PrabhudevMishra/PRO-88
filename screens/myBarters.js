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

export default class MyBarters extends React.Component {
  constructor() {
    super();
    this.state = {
      allDonations: [],
      donorId: firebase.auth().currentUser.email,
      donorName: "",
    };
    this.requestRef = null;
  }
  getAllDonations = () => {
    this.requestRef = db
      .collection("all_donations")
      .where("donor_id", "==", this.state.donorId)
      .onSnapshot((snapShot) => {
        var allDonationList = [];
        snapShot.docs.map((doc) => {
          var donation = doc.data();
          donation["doc_id"] = doc.id;
          allDonationList.push(donation);
        });
        this.setState({
          allDonations: allDonationList,
        });
      });
  };

  getUserDetails(userId) {
    db.collection("users")
      .where("username", "==", userId)
      .get()
      .then((snaphot) => {
        snaphot.forEach((doc) => {
          this.setState({
            donorName: doc.data().first_name + " " + doc.data().last_name,
          });
        });
      });
  }

  sendItem = (itemDetails) => {
    if (itemDetails.request_status === "Item Exchanged") {
      var requestStatus = "Donor Interested";
      db.collection("all_donations").doc(itemDetails.doc_id).update({
        request_status: "Donor Interested",
      });
      this.sendNotification(itemDetails, requestStatus);
    } else {
      var requestStatus = "Item Exchanged";
      db.collection("all_donations").doc(itemDetails.doc_id).update({
        request_status: "Item Exchanged",
      });
      this.sendNotification(itemDetails, requestStatus);
    }
  };

  sendNotification = (itemDetails, requestStatus) => {
    var requestId = itemDetails.request_id;
    var donorId = itemDetails.donor_id;
    var itemName = itemDetails.items_name;

    db.collection("all_notifications")
      .where("request_id", "==", requestId)
      .where("donor_id", "==", donorId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var message = "";
          if (requestStatus === "Item Exchanged") {
            message = this.state.donorName + " exchanged " + itemName;
          } else {
            message =
              this.state.donorName +
              " has shown interest in exchanging " +
              itemName;
          }
          db.collection("all_notifications").doc(doc.id).update({
            message: message,
            notification_status: "unread",
            date: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
      });
  };

  componentDidMount() {
    this.getUserDetails(this.state.donorId);
    this.getAllDonations();
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
        subtitle={
          "Requested by: " +
          item.requested_by +
          "\nStatus: " +
          item.request_status
        }
        titleStyle={{ color: "black", fontWeight: "bold" }}
        leftElement={<Icon name="book" type="fontawesome5" color="#f2f50f" />}
        rightElement={
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor:
                  item.request_status === "Item Exchanged"
                    ? "green"
                    : "#ff5722",
              },
            ]}
            onPress={() => {
              this.sendItem(item);
            }}
          >
            <Text style={{ color: "#ffff" }}>
              {item.request_status === "Item Exchanged"
                ? "Item Exchanged"
                : "Exchange Item"}
            </Text>
          </TouchableOpacity>
        }
        bottomDivider
      />
    );
  };
  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader title="My Barters" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.allDonations.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>List of all barters</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allDonations}
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
