import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { UserStyle } from "../styles/UserStyle";
import { Auth } from "aws-amplify";

const initialState = {
  Username: "",
  password: "",
  confirmPassword: "",
};

export default (props) => {
  const [formState, setFormState] = useState(initialState);
  const [isLoading, setLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  const navigation = useNavigation();

  const onHandleChange = (key, value) => {
    setFormState({ ...formState, [key]: value });
  };
  useEffect(() => {
    if (
      formState.Username !== "" &&
      formState.password !== "" &&
      formState.confirmPassword !== ""
    ) {
      setDisable(false);
    }
  }, [formState]);
  const onSubmit = async () => {
    try {
      const FormState = { ...formState };
      if (FormState.password !== FormState.confirmPassword) {
        Alert.alert("Password and Confirm Password should be match");
      }
      setLoading(true);
      const user = await Auth.signUp({
        username: FormState.Username,
        password: FormState.password,
      });
      setLoading(false);
      Alert.alert("User Created Successfully");
      setFormState(initialState);
    } catch (error) {
      setLoading(false);
      console.log(error);
      Alert.alert(error.message);
    }
  };

  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{ x: 20, y: 0 }}
      contentContainerStyle={UserStyle.signUiView}
      scrollEnabled={false}
    >
      <View style={UserStyle.formStyle}>
        <View style={UserStyle.textInputContiner}>
          <Image
            source={require("../../assets/user.png")}
            style={UserStyle.textFieldIcon}
          />

          <TextInput
            style={UserStyle.textInput}
            placeholder="Username"
            placeholderTextColor="#000"
            value={formState.username}
            onChangeText={(val) => onHandleChange("Username", val)}
          />
        </View>

        <View style={UserStyle.textInputContiner}>
          <Image
            source={require("../../assets/lock.png")}
            style={UserStyle.textFieldIcon}
          />
          <TextInput
            style={UserStyle.textInput}
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor="#000"
            value={formState.password}
            onChangeText={(val) => onHandleChange("password", val)}
          />
        </View>
        <View style={UserStyle.textInputContiner}>
          <Image
            source={require("../../assets/lock.png")}
            style={UserStyle.textFieldIcon}
          />
          <TextInput
            style={UserStyle.textInput}
            placeholder="Confirm Password"
            placeholderTextColor="#000"
            secureTextEntry={true}
            value={formState.confirmPassword}
            onChangeText={(val) => onHandleChange("confirmPassword", val)}
          />
        </View>
        <TouchableOpacity
          style={UserStyle.buttonStyle}
          onPress={onSubmit}
          disabled={disable}
        >
          {isLoading ? (
            <ActivityIndicator animating={isLoading} />
          ) : (
            <Text>Sign Up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity>
          <Text>Already have an account?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};
