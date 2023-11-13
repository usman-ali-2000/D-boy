import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, Image, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Chat({route}){
    
    const navigation = useNavigation();

    const name = route.params.name;
    const customerEmail = route.params.email;
    const riderEmail = route.params.riderEmail;
    // const customerToken = route.params.customerToken;
    const [customToken, setCustomToken] = useState('');

    const fetchToken=async()=>
    
    {
        const response = await fetch('http://192.168.100.2:8000/customer');
        const json = await response.json();
        const selectedData = json.filter(item => item.email === customerEmail );
        // console.log(selectedData);
        const customerToken = selectedData[0].pushtoken;
        setCustomToken(customerToken);
        console.log('customToken:',customToken);

      }

    
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: name,
    });
  }, [navigation]);


    const [chat, setChat] = useState('');
    const [customerData, setCustomerData] = useState('');
    const [riderData, setRiderData] = useState('');

    const fetchChat=async()=>{
       
         const response = await fetch('http://192.168.100.2:8000/chat');
         const json = await response.json();
 
         const getRider = await json.filter((item)=> item.from === riderEmail && item.to === customerEmail || item.from === customerEmail && item.to === riderEmail );
        //  const getCustomer = await json.filter((item)=> item.from === customerEmail && item.to === riderEmail);
         setRiderData(getRider);
        //  console.log(riderData);

    }

    const sendNotificationToServer = async () => {
      // console.log('token',customerToken); 
      try{
          const response = await fetch("https://fcm.googleapis.com/fcm/send", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAA8kQDGcI:APA91bG-nix_y94TgwLlMba2jsWURujKlrsq_DI21g8vNDsqyBwFbgnljWxNplVyjrfi2CwvMYVkDvnfOjTuMffHPKYXm5yZ0Ypj2BOx9tWwppS3aB_jNJKW94BsT2vkCghprs_rShMU',
            },
            body: `{
            "to": "${customToken}",
            "collapse_key": "type_a",
            "notification": {
                "body": "new message from rider",
                "title": "Rider",
            },
            "data": {
                "body": "new message from rider",
                "title": "Picked...",
                "key_1": "Bill",
                "key_2": "20...30 mins"
            }
        }`,
        });
      
        response.json().then(data => {
            console.log(data);
        });
      }
      catch(e) {
      console.log("Error: sendNotificationForLike>>", e)
      }
  }

    const sendChat=async()=>{
        if(chat !== '' && customToken !==''){
            const data = { to:customerEmail, from:riderEmail, text:chat };
        await fetch('http://192.168.100.2:8000/chat', {
        method:'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(response => response.json())
      .then(json => {console.log(json)
    })
      .catch(error => console.error(error))
       sendNotificationToServer();
        console.log('chat:', chat);
        setChat('');
        }
    }

    useEffect(()=>{
      fetchToken();
    },[]);

    useEffect(()=>{

        fetchChat();
    },[riderData]);

    return(
        <View style={{height:'100%', flexDirection:'column'}}>
            <FlatList
            style={{flex:1,height:'92%'}}
            data={riderData}
            keyExtractor={(item)=>item._id}
            renderItem={({item})=>{
                return(

                    <View style={item.from===riderEmail?{ margin:10, padding:5, maxWidth:'70%', backgroundColor:'blue', marginVertical:5, alignSelf:'flex-end', borderRadius:10}:{margin:10, padding:5, maxWidth:'70%', backgroundColor:'white', marginVertical:5, alignSelf:'flex-start', borderRadius:10} }>
                    <Text style={item.from===riderEmail? { textAlign:'right', fontSize:20, color:'white'}:{textAlign:'left', fontSize:20, color:'black'}}>{item.text}</Text>
                    </View>
                    
                );
            }}
            inverted={true}
            />
            <View style={{borderWidth:1, borderColor:'lightgrey', height:40, borderRadius:30, flexDirection:'row'}}>
                <TextInput
                style={{fontSize:20, paddingLeft:5, width:320}}
                placeholder="type here..."
                onChangeText={(txt)=>setChat(txt)}
                value={chat}
                multiline={true}
                />
                <TouchableOpacity onPress={sendChat}>
                <Image style={{height:35, width:35, marginTop:2}} source={require('../assets/paper-plane.png')}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}