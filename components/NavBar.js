import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity, Text, View, Image } from "react-native";

export default function NavBar(props){

const email = props.message;

const navigation = useNavigation();


    return(
        <View style={{flexDirection:'row', paddingHorizontal:20, paddingTop:10, paddingBottom:10, backgroundColor:'lightgrey'}}> 
            <TouchableOpacity onPress={()=>navigation.navigate('Home')}>
        <Image style={{height:30, width:30, marginLeft:40}} source={require('../assets/home.png')}/>
    </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('Notifications', {email: email})}>
                <Image style={{height:30, width:30, marginLeft:60 }} source={require('../assets/notification.png')}/>
            </TouchableOpacity>
            <TouchableOpacity>
                <Image style={{height:30, width:30, marginLeft:70 }} source={require('../assets/messenger.png')}/>
            </TouchableOpacity>
        </View>
    )
}