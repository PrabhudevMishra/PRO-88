import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import MyHeader from "../components/myHeader";

export default class RequestScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      itemsName: "",
      itemsDescription: "",
      requestId: "",
      requestedItemName: "",
      itemStatus: "",
      docId: "",
      userDocId: "",
      isRequestStatusActive: false,
      currency: "",
      itemValue: "",
      requestedItemValue: "",
    };
  }

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  addRequest = async (itemsName, itemsDescription) => {
    var userId = this.state.userId;
    var randomRequestId = this.createUniqueId();
    db.collection("requested_items").add({
      user_id: this.state.userId,
      items_name: this.state.itemsName,
      items_description: this.state.itemsDescription,
      request_id: randomRequestId,
      item_status: "requested",
      date: firebase.firestore.FieldValue.serverTimestamp(),
      item_value: this.state.itemValue,
    });
    await this.getItemRequest();
    db.collection("users")
      .where("username", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            isRequestStatusActive: true,
          });
        });
      });
    this.setState({
      itemsName: "",
      itemsDescription: "",
      itemValue: "",
      request_id: randomRequestId,
    });
    return Alert.alert("Item added Sucessfully.");
  };

  getItemRequest = async () => {
    db.collection("requested_items")
      .where("user_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().item_status !== "received") {
            this.setState({
              requestId: doc.data().request_id,
              requestedItemName: doc.data().items_name,
              itemStatus: doc.data().item_status,
              docId: doc.id,
              requestedItemValue: doc.data().item_value,
            });
          }
        });
      });
  };

  getIsRequestStatusActive = () => {
    db.collection("users")
      .where("username", "==", this.state.userId)
      .onSnapshot((qry) => {
        qry.forEach((doc) => {
          this.setState({
            isRequestStatusActive: doc.data().isRequestStatusActive,
            userDocId: doc.id,
            currency: doc.data().currency,
          });
        });
      });
  };

  getData = () => {
    fetch(
      "http://data.fixer.io/api/latest?access_key=73186ec71c55c32aa389edaf2b257bb0&format=1"
    )
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        var currencyCode = this.state.currency;
        var currency = responseData.rates.INR;
        var value = 69 / currency;
        console.log(value);
      });
  };

  sendNotification = () => {
    db.collection("users")
      .where("username", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var firstName = doc.data().first_name;
          var lastName = doc.data().last_name;

          db.collection("all_notifications")
            .where("request_id", "==", this.state.requestId)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var donorId = doc.data().donor_id;
                var itemName = doc.data().items_name;
                db.collection("all_notifications").add({
                  targeted_user_id: donorId,
                  message:
                    firstName +
                    " " +
                    lastName +
                    " received the item " +
                    bookName,
                  notification_status: "unread",
                  items_name: itemName,
                });
              });
            });
        });
      });
  };

  updateRequestStatus = () => {
    db.collection("requested_items").doc(this.state.docId).update({
      item_status: "received",
    });

    db.collection("users")
      .where("username", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            isRequestStatusActive: false,
          });
        });
      });
  };

  receivedItems = (itemName) => {
    db.collection("received_items").add({
      user_id: this.state.userId,
      items_name: itemName,
      request_id: this.state.requestId,
      items_status: "received",
    });
  };

  componentDidMount() {
    this.getItemRequest();
    this.getIsRequestStatusActive();
    this.getData();
  }

  render() {
    if (this.state.isRequestStatusActive) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <View
            style={{
              justifyContent: "center",
              borderColor: "orange",
              borderWidth: 2,
              alignItems: "center",
              padding: 10,
              margin: 10,
            }}
          >
            <Text>Item Name:</Text>

            <Text>{this.state.requestedItemName}</Text>
          </View>

          <View
            style={{
              justifyContent: "center",
              borderColor: "orange",
              borderWidth: 2,
              alignItems: "center",
              padding: 10,
              margin: 10,
            }}
          >
            <Text>Item status:</Text>

            <Text>{this.state.itemStatus}</Text>
          </View>

          <View
            style={{
              justifyContent: "center",
              borderColor: "orange",
              borderWidth: 2,
              alignItems: "center",
              padding: 10,
              margin: 10,
            }}
          >
            <Text>Item Value:</Text>

            <Text>{this.state.requestedItemValue}</Text>
          </View>

          <TouchableOpacity
            style={{
              borderColor: "orange",
              borderWidth: 1,
              backgroundColor: "orange",
              widht: 360,
              alignSelf: "center",
              alignItems: "center",
              height: 30,
              marginTop: 30,
              borderRadius: 8,
            }}
            onPress={() => {
              this.sendNotification();
              this.updateRequestStatus();
              this.receivedItems(this.state.requestedItemName);
            }}
          >
            <Text>I received the Item</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <MyHeader title="Request Items" navigation={this.props.navigation} />
          <KeyboardAvoidingView
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <TextInput
              style={styles.formTextInput}
              placeholder={"Enter Item Name"}
              onChangeText={(txt) => {
                this.setState({
                  itemsName: txt,
                });
              }}
              value={this.state.itemsName}
            />

            <TextInput
              style={[styles.formTextInput, { height: 300 }]}
              placeholder={"Item description"}
              multiline={true}
              numberOfLines={8}
              onChangeText={(txt) => {
                this.setState({
                  itemsDescription: txt,
                });
              }}
              value={this.state.itemsDescription}
            />

            <TextInput
              style={styles.formTextInput}
              placeholder={"Enter Item Value"}
              onChangeText={(txt) => {
                this.setState({
                  itemValue: txt,
                });
              }}
              value={this.state.itemValue}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.addRequest(
                  this.state.itemsName,
                  this.state.itemsDescription
                );
              }}
            >
              <Text>Request</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  formTextInput: {
    width: "75%",
    height: 35,
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    alignSelf: "center",
  },
  button: {
    width: "75%",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: "#956",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
});
