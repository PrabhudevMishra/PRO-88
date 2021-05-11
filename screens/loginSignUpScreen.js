import * as React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import BarterAnimation from "../components/barter";

export default class LoginSignUpScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      mobile: "",
      address: "",
      confirmPassword: "",
      isModalVisible: false,
      currency: "",
    };
  }

  userLogin = (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        this.props.navigation.navigate("Donate");
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        return Alert.alert(errorMessage);
      });
  };

  userSignUp = (email, password, confirmPassword) => {
    if (password !== confirmPassword) {
      return Alert.alert("Password doesn't match\nCheck your password");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          db.collection("users").add({
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            address: this.state.address,
            mobile_number: this.state.mobile,
            username: this.state.email,
            isRequestStatusActive: false,
            currency: this.state.currency,
          });
          return Alert.alert("User Signed up sucessfully", "", [
            {
              text: "OK",
              onPress: () => {
                this.setState({
                  isModalVisible: false,
                });
              },
            },
          ]);
        })
        .catch(function (error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          return Alert.alert(errorMessage);
        });
    }
  };

  showModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isModalVisible}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={{ width: "100%" }}>
            <KeyboardAvoidingView
              style={styles.keyboardAvoidingView}
              behavior="padding"
              enabled
            >
              <Text style={styles.modalTitle}>Registration</Text>

              <TextInput
                style={styles.formTextInput}
                placeholder={"First Name"}
                maxLength={16}
                onChangeText={(txt) => {
                  this.setState({
                    firstName: txt,
                  });
                }}
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
              />

              <TextInput
                style={styles.formTextInput}
                placeholder={"abc@example.com"}
                onChangeText={(txt) => {
                  this.setState({
                    email: txt,
                  });
                }}
              />

              <TextInput
                style={styles.formTextInput}
                placeholder={"Password"}
                secureTextEntry
                onChangeText={(txt) => {
                  this.setState({
                    password: txt,
                  });
                }}
              />

              <TextInput
                style={styles.formTextInput}
                placeholder={"Confirm password"}
                secureTextEntry
                onChangeText={(txt) => {
                  this.setState({
                    confirmPassword: txt,
                  });
                }}
              />

              <TextInput
                style={styles.formTextInput}
                placeholder={"Currency"}
                maxLength={3}
                onChangeText={(txt) => {
                  this.setState({
                    currency: txt,
                  });
                }}
                value={this.state.currency}
              />

              <View style={styles.modalBackButton}>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() => {
                    this.userSignUp(
                      this.state.email,
                      this.state.password,
                      this.state.confirmPassword
                    );
                  }}
                >
                  <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalBackButton}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    this.setState({
                      isModalVisible: false,
                    });
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.showModal()}
        <KeyboardAvoidingView behavior="padding" enabled>
          <View
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          >
            <BarterAnimation />
            <Text style={styles.title}>Barter</Text>
          </View>
          <View>
            <TextInput
              style={styles.loginBox}
              placeholder={"abc@example.com"}
              keyboardType={"email-address"}
              onChangeText={(txt) => {
                this.setState({
                  email: txt,
                });
              }}
            />

            <TextInput
              style={styles.loginBox}
              placeholder={"Enter password"}
              secureTextEntry={true}
              onChangeText={(txt) => {
                this.setState({
                  password: txt,
                });
              }}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.userLogin(this.state.email, this.state.password);
              }}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.setState({
                  isModalVisible: true,
                });
              }}
            >
              <Text style={styles.buttonText}>SignUp</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
  // modalBackButton: {
  //   alignItems: "center",
  //   justifyContent: "center",
  //   borderWidth: 1,
  //   width: 150,
  //   height: 50,
  //   margin: 10,
  //   alignSelf: "center",
  // },
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
