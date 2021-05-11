import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import MyHeader from "../components/myHeader";

export default class SettingScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      address: "",
      firstName: "",
      lastName: "",
      mobile: "",
      email: "",
      docId: "",
    };
  }

  updateUserDetails = async () => {
    db.collection("users").doc(this.state.docId).update({
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      address: this.state.address,
      mobile_number: this.state.mobile,
    });
    Alert.alert("Profile updated sucessfully.");
  };

  getUserDetails = async () => {
    var userId = firebase.auth().currentUser.email;
    db.collection("users")
      .where("username", "==", userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            firstName: doc.data().first_name,
            lastName: doc.data().last_name,
            address: doc.data().address,
            mobile: doc.data().mobile_number,
            docId: doc.id,
          });
        });
      });
  };

  componentDidMount() {
    this.getUserDetails();
  }
  render() {
    return (
      <View>
        <MyHeader title="Settings" navigation={this.props.navigation} />
        <View>
          <TextInput
            style={styles.formTextInput}
            placeholder={"First Name"}
            maxLength={16}
            onChangeText={(txt) => {
              this.setState({
                firstName: txt,
              });
            }}
            value={this.state.firstName}
          />

          <TextInput
            style={styles.formTextInput}
            placeholder={"Last Name"}
            maxLength={8}
            onChangeText={(txt) => {
              this.setState({
                lastName: txt,
              });
            }}
            value={this.state.lastName}
          />

          <TextInput
            style={styles.formTextInput}
            placeholder={"Contact"}
            maxLength={10}
            keyboardType="numeric"
            onChangeText={(txt) => {
              this.setState({
                mobile: txt,
              });
            }}
            value={this.state.mobile}
          />

          <TextInput
            style={styles.formTextInput}
            placeholder={"Address"}
            multiline={true}
            onChangeText={(txt) => {
              this.setState({
                address: txt,
              });
            }}
            value={this.state.address}
          />

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => {
              this.updateUserDetails();
            }}
          >
            <Text style={styles.registerButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff4f0f",
  },
  loginBox: {
    width: 300,
    height: 40,
    borderWidth: 1.5,
    fontSize: 20,
    margin: 10,
    paddingLeft: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 50,
    fontWeight: "bold",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    width: 150,
    height: 50,
    margin: 10,
    alignSelf: "center",
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    justifyContent: "center",
    alignSelf: "center",
    fontSize: 20,
    color: "#168",
    margin: 50,
  },

  modalContainer: {
    flex: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "yellow",
    marginRight: 30,
    marginLeft: 30,
    marginTop: 80,
    marginBottom: 80,
  },

  formTextInput: {
    width: "75%",
    height: 35,
    alignSelf: "center",
    borderColor: "blue",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  registerButtonText: {
    color: "orange",
    fontSize: 15,
    fontWeight: "bold",
  },
  registerButton: {
    width: 200,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 30,
    alignSelf: "center",
  },
  cancelButtonText: {
    color: "pink",
  },
  cancelButton: {
    width: 200,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
});
