import { useNavigation } from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {Text, Button, ScrollView, TextInput, RefreshControl, TouchableOpacity, Alert} from "react-native";
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Api_Url = 'http://192.168.100.2:8000/dboy';

export default function Login(){
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [userData, setUserData] = useState([]);
    const [isRefreshing, setRefreshing] = useState(false);
    const [isState, setState] = useState(false);
    const [expoPushToken, setExpoPushToken] = useState('');
    const fetchData = async()=>{
     try{
       const response = await fetch(Api_Url);
       const json = await response.json();
       console.log('json:', json); 
       setUserData(json);
 
      const idInfo = json.filter((item)=> item.email === loginEmail);
       const id2 = idInfo.filter((item)=> item._id);
       // setAdminId(id2);
 
       }catch(error){
         console.log('error in fetching');
       }
       
     }
     async function GetFCMToken() {
       try {
         let fcmtoken = await AsyncStorage.getItem("fcmtoken");
         console.log(fcmtoken, "oldtoken");
         if (!fcmtoken) {
           fcmtoken = await messaging().getToken();
           await AsyncStorage.setItem("fcmtoken", fcmtoken);
           console.log(fcmtoken, "newtoken");
         }
         setExpoPushToken(fcmtoken); // Set the adminToken state with the FCM token
       } catch (e) {
         console.log(e, "error fcmToken");
       }
     }
   
     
     useEffect(() => {
         fetchData();
       GetFCMToken();
       }, []);
 
       
       React.useEffect(()=>{
         const unsubscribe = navigation.addListener('focus', ()=>{
           setRefreshing(true);
           fetchData();
           setTimeout(()=>
           setRefreshing(false), 2000);
         });
         return unsubscribe;     
       }, []);
 
     const navigation = useNavigation(); 
 
     const handleSubmit = async () => {
         try {
         const user = userData.find(
          (item) => item.email === loginEmail && item.password === loginPassword
           );
       
           if (user){
             // set user state to true
             setState(true);
       
         
             // redirect to main screen
             navigation.replace("Home",{email: loginEmail});
           } else {
             Alert.alert("Invalid email or password");
           }
         } catch (error) {
           console.error("Error while login", error);
           Alert.alert("Error while login", error.message);
         }
       };
    
     const handleNavigation =()=>{
         navigation.navigate('Register');
     }
 
     const handleRefresh=async()=>{
         setRefreshing(true);
        await fetchData()
         .then(()=>setRefreshing(false));
     }
 
     const user2 = userData.find(item =>  item.email === loginEmail);
    
 
     const updatePushToken= async ()=>{
  
       const pt = user2.pushtoken;
       const adminId = user2._id;
 
       if(expoPushToken === pt){
 
         return;
       
       }else{
         await fetch(`http://192.168.100.2:8000/students/${adminId}`, {
           method: 'PATCH',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({ pushtoken: expoPushToken }),
         });
       }
     }
 
     const handleLogin = async()=>{
           await updatePushToken();
       handleSubmit();
     }
 
     return(
         <ScrollView
         refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh}/>}>
    <Text>Login</Text>
    <TextInput
     placeholder="Email"
     value={loginEmail}
     onChangeText={setLoginEmail}
     />
     <TextInput
     placeholder="Password"
     secureTextEntry={true}
     value={loginPassword}
     onChangeText={setLoginPassword}
     />
     <Text>if you're not registered please</Text>
     <TouchableOpacity onPress={handleNavigation}><Text style={{color:'blue'}}>Sign Up</Text></TouchableOpacity>
     <Button 
     title="Login"
     onPress={handleLogin}/>
     </ScrollView> 
     )
 }