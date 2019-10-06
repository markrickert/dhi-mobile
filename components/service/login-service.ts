import superagent from "superagent";
import * as SecureStore from "expo-secure-store";
import { AsyncStorage } from "react-native";

const baseUrl = "http://192.168.101.39:8080";
// const baseUrl = "http://run.ict.mahidol.ac.th:443/proxy";
export const login = (username, password) => {
  const url = `${baseUrl}/oauth/token`;
  return superagent
    .post(url)
    .type("form")
    .send({ username, password, grant_type: 'password', client_id: 'my-client', client_secret: 'secret' })
    .then(data => {
      // const newLocal = data.header;
      // const cookie = newLocal["set-cookie"];
      if (data.body.access_token) {
        // if (data.redirects[0] !== baseUrl) {
        storeLogin(username, password, data.body.access_token);
        return true;
      } else return false;
    }).catch(e => {
      // console.error(e)
      return false
    })
};

export const isLogin = async () => {
  const username = await SecureStore.getItemAsync("username");
  return username !== null;
};
export const logout = async () => {
  await SecureStore.deleteItemAsync("username");
  await SecureStore.deleteItemAsync("password");

  await AsyncStorage.multiRemove(['currentPatient'])
};

const storeLogin = async (username, password, token) => {
  SecureStore.setItemAsync("username", username);
  SecureStore.setItemAsync("password", password);
  SecureStore.setItemAsync("token", token);

};

export const getToken = () => {
  return SecureStore.getItemAsync("token")
}