import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Main from "./components/Main";
import { AppRegistry } from "react-native";
import Login from "./components/Login";
import Register from "./components/Register";
import Notifications from "./components/Notifications";
import Bill from "./components/Bill";
import Chat from "./components/Chat";

const Stack = createNativeStackNavigator();


AppRegistry.registerComponent('MyApp', ()=>App);

export default function App(){
 
  return(
    <NavigationContainer>
      <Stack.Navigator> 
      <Stack.Screen name="Login" component={Login}/>
      <Stack.Screen name="Home" component={Main}/> 
      <Stack.Screen name="Register" component={Register}/>
      <Stack.Screen name="Notifications" component={Notifications}/> 
      <Stack.Screen name="Bill" component={Bill}/> 
      <Stack.Screen name="Chat" component={Chat}/> 
      </Stack.Navigator>
    </NavigationContainer>
  )};

