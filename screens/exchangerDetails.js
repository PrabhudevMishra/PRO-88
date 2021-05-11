import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import { Header, Icon, Card } from "react-native-elements";

export default class ExchangerDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      userName: "",
      receiverAddress: "",
      receiverContact: "",
      receiverName: "",
      receiverRequestDocId: "",
      receiverId: this.props.navigation.getParam("details")["user_id"],
      requestId: this.props.navigation.getParam("details")["request_id"],
      itemName: this.props.navigation.getParam("details")["items_name"],
      itemDescription: this.props.navigation.getParam("details")[
        "items_description"
      ],
    };
  }

  getUserDetails(userId) {
    db.collection("users")
      .where("username", "==", userId)
      .get()
      .then((snaphot) => {
        snaphot.forEach((doc) => {
          this.setState({
            userName: doc.data().first_name + " " + doc.data().last_name,
          });
        });
      });
  }

  getReceiverDetails() {
    db.collection("users")
      .where("username", "==", this.state.receiverId)
      .get()
      .then((snaphot) => {
        snaphot.forEach((doc) => {
          this.setState({
            receiverName: doc.data().first_name,
            receiverContact: doc.data().mobile_number,
            receiverAddress: doc.data().address,
          });
        });
      });

    db.collection("requested_items")
      .where("request_id", "==", this.state.requestId)
      .get()
      .then((snaphot) => {
        snaphot.forEach((doc) => {
          this.setState({
            receiverRequestDocId: doc.id,
          });
        });
      });
  }

  updateItemStatus = () => {
    db.collection("all_donations").add({
      items_description: this.state.itemDescription,
      items_name: this.state.itemName,
      request_id: this.state.requestId,
      donor_id: this.state.userId,
      requested_by: this.state.receiverName,
      request_status: "Donor Interested",
    });
  };

  addNotification = () => {
    var msg =
      this.state.userName + " has shown interest in exchanging the item.";
    db.collection("all_notifications").add({
      targeted_user_id: this.state.receiverId,
      items_name: this.state.itemName,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      donor_id: this.state.userId,
      notification_status: "unread",
      message: msg,
      request_id: this.state.requestId,
    });
  };
  componentDidMount() {
    this.getUserDetails(this.state.userId);
    this.getReceiverDetails();
  }
  render() {
    return (
      <ScrollView>
        <View style={{ flex: 1 }}>
          <View>
            <Header
              leftComponent={
                <Icon
                  name="arrowleft"
                  type="antdesign"
                  color="#fff"
                  onPress={() => {
                    this.props.navigation.goBack();
                  }}
                />
              }
              centerComponent={{
                text: "Donate Items",
                style: { color: "#202", fontSize: 20, fontWeight: "bold" },
              }}
              backgroundColor="#160"
            />
          </View>
          <View>
            <Card title={"Item Information"} titleStyle={{ fontSize: 15 }}>
              <Card>
                <Text style={{ fontWeight: "bold" }}>
                  Name:{this.state.itemName}
                </Text>
              </Card>

              <Card>
                <Text style={{ fontWeight: "bold" }}>
                  Description:{this.state.itemDescription}
                </Text>
              </Card>
            </Card>

            <Card title={"Receiver Information"} titleStyle={{ fontSize: 15 }}>
              <Card>
                <Text style={{ fontWeight: "bold" }}>
                  Name:{this.state.receiverName}
                </Text>
              </Card>

              <Card>
                <Text style={{ fontWeight: "bold" }}>
                  Contact:{this.state.receiverContact}
                </Text>
              </Card>

              <Card>
                <Text style={{ fontWeight: "bold" }}>
                  Address:{this.state.receiverAddress}
                </Text>
              </Card>
            </Card>
          </View>

          <View>
            {this.state.receiverId !== this.state.userId ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.updateItemStatus();
                  this.addNotification();
                  this.props.navigation.navigate("MyBarters");
                }}
              >
                <Text>I want to exchange</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    marginTop: 16,
    width: 200,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff5722",
    alignSelf: "center",
    borderRadius: 10,
  },
});
