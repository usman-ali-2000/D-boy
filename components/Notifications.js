import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import NavBar from "./NavBar";
import { useNavigation } from "@react-navigation/native";


export default function Notifications({route}){

    const email = route.params.email;
    
     const navigation = useNavigation();

    const [userData, setUserData] = useState('');

    const backColor = 'lightblue';

    const fetchNotification=async()=>{
        const response = await fetch('http://192.168.100.2:8000/deliverynoti');
        const json = await response.json();
        setUserData(json);
    }
useEffect(()=>{
    fetchNotification();
},[fetchNotification]);

    return(
        <View style={{height:'100%'}}>
            <NavBar/>
            <FlatList
         contentContainerStyle={{paddingHorizontal:10}}
         data={userData}
         keyExtractor={(item) => item._id}
        //  refreshControl ={
        //  <RefreshControl
        //  refreshing = {refreshing}
        //  onRefresh={handleRefresh}/>
        //  }
         renderItem={({item}) => {
         return(
              <TouchableOpacity onPress={()=>navigation.navigate('Bill',{billId: item.billid, notiId: item._id, email: email})}>
            <View style={{borderWidth:2, borderColor: item.status === 'open'? 'white':'lightblue', height:80, marginBottom:5, marginTop:10, borderRadius:20, backgroundColor: item.status === 'open'? 'white':'lightblue'}}>
            <Text style={{fontSize:20, fontWeight:'bold', paddingLeft:20}}>{item.name}</Text>
            <Text style={{paddingLeft:20}}>{item.address}</Text>
            </View>
            </TouchableOpacity>
         )
         }}
         />
        </View>
    )
}