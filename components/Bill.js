import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, ScrollView } from "react-native";

export default function Bill({route}){

    const navigation = useNavigation();

    const billId = route.params.billId;
    const notiId = route.params.notiId;
    const RiderEmail = route.params.email;

    const [userData, setUserData] = useState([]);
    const [customToken, setCustomToken] = useState('');
    const[billStatus, setBillStatus] = useState('');
    const [chatName, setChatName] = useState('');
    const [chatEmail, setChatEmail] = useState('');

    const fetchBill=async()=>{
     
        const response = await fetch('http://192.168.100.2:8000/bill');
         const json = await response.json();
         const getBill = await json.find(item => item._id === billId);
         setUserData([getBill]); 
         const name = getBill.name;
         const email = getBill.email;
         setChatName(name);
         setChatEmail(email);

         console.log(name,email,RiderEmail);
    
    
    }

    const sendNotificationToServer = async () => {
 
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
                  "body": "${billStatus}",
                  "title": "Rider",
              },
              "data": {
                  "body": "${RiderEmail}",
                  "title": "Fiyer",
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

    const fetchToken=async(email)=>
    
    {
        const response = await fetch('http://192.168.100.2:8000/customer');
        const json = await response.json();
        const selectedData = json.filter(item => item.email === email );
        // console.log(selectedData);
        const customerToken = selectedData[0].pushtoken;
        setCustomToken(customerToken);
        console.log(customToken);

      }

      
      const notificationStatus=async()=>{

        await fetch(`http://192.168.100.2:8000/deliverynoti/${notiId}`, {
                      method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ status: 'open' }),
                    });
                    // setOrderStatus(true);
                    console.log('status', billStatus);
        
                }

      const updateStatus=async(status)=>{
        
        setBillStatus(status);
        
        if(customToken !== '' && billStatus !== ''){
            await fetchBill();
            await sendNotificationToServer();
            const patchContent = await fetch(`http://192.168.100.2:8000/bill/${billId}`, {
                      method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ status: status }),
                    });
                    // setOrderStatus(true);
                    console.log('status',billStatus);
                  }
      }

    const pickOrder=async(email)=>{
        try{
            await fetchToken(email);
            await updateStatus('Picked...');    
            }catch(e){
              console.log('error fetching token...',e);
            }
    }

    const orderDeliver=async(email)=>{
        try{
            await fetchToken(email);
            await updateStatus('Delivered');
            await notificationStatus();    
            }catch(e){
              console.log('error fetching token...',e);
            }
    }

    useEffect(()=>{

        fetchBill();
        console.log('billId:', billId);


    },[]);

    return(
         <FlatList
         contentContainerStyle={{paddingHorizontal:10}}
         data={userData}
         keyExtractor={(item) => item._id}
         renderItem={({item}) => {
         return(
          <View style={{borderColor:'grey',backgroundColor:'white', borderRadius:10, marginVertical:5}}>
            <View style={{flexDirection:'row', marginVertical:5}}>
            <Text style={{fontSize:20, fontWeight:'bold'}}>name: {item.name}</Text>
            </View>
            <Text style={{fontSize:20, fontWeight:'bold', marginVertical:5}}>address: {item.address}</Text>
            <Text style={{fontSize:20, fontWeight:'bold', marginVertical:5}}>email: {item.email}</Text>
            <Text style={{fontSize:20, fontWeight:'bold', marginVertical:5}}>phone: {item.phone}</Text>
            <View style={{flexDirection:'row', marginVertical:5}}>
            <Text style={{fontSize:20, fontWeight:'bold'}}>status:</Text>
            <Text style={{fontSize:20, fontWeight:'bold', marginLeft:10, color:'green'}}>{item.status}</Text>
            </View>
            <View style={{flexDirection:'row', borderBottomColor:'grey', borderBottomWidth:1}}>
                <View style={{flexDirection:'column'}}>
                <Text style={{fontWeight:'bold', fontSize:20}}>Category</Text>
                    {
                        item.category.map((categoryItem, index) => (
                            <View key={index}>
                            <Text style={{fontSize:20, width:80, height:50}}>{categoryItem}</Text>
                            </View>
                            ))
                    }
                    <Text style={{fontSize:20, width:80, height:50}}>delivery charges</Text>
                    <Text style={{fontSize:20, height:50}}>tax</Text>
                    <Text style={{fontSize:20, borderTopColor:'grey', borderTopWidth:2, height:50}}>total</Text>
                </View>
                <View style={{flexDirection:'column', marginLeft:10}}>
                <Text style={{fontWeight:'bold', fontSize:20}}>Items</Text>
                    {
                        item.text.map((textItem, index) => (
                            <View key={index}>
                            <Text style={{fontSize:20, width:130, height:50}}>{textItem}</Text>
                            </View>
                            ))
                    }
                </View>
                <View style={{flexDirection:'column', marginLeft:10}}>
                <Text style={{fontWeight:'bold', fontSize:20}}>Price</Text>
                    {
                        item.price.map((priceItem, index) => (
                            <View key={index}>
                            <Text style={{fontSize:20, height:50}}>{priceItem}</Text>
                            </View>
                            ))
                    }
                    <Text style={{fontSize:20, height:50}}>{item.delivery}</Text>
                    <Text style={{fontSize:20, height:50}}>{item.tax}</Text>
                    <Text style={{fontSize:20, borderTopColor:'grey', borderTopWidth:2, height:50}}>{item.total}</Text>
                </View>
                <View style={{flexDirection:'column', marginLeft:10}}>
                <Text style={{fontWeight:'bold', fontSize:20}}>Qty</Text>
                    {
                        item.quantity.map((quantityItem, index) => (
                            <View key={index}>
                            <Text style={{fontSize:20, height:50}}>{quantityItem}</Text>
                            </View>
                            ))
                    }
                </View>
            </View>
                <Text style={{fontSize:20, fontWeight:'bold'}}>date: {item.date}</Text>
            <View style={{flexDirection:'row'}}>
                <View style={{padding:10, width:150, marginLeft:20}}>
            <Button title='Pick' onPress={()=>pickOrder(item.email)}/>
            </View>
            <View style={{padding:10, width:150}}>      
            <Button title='Deliver' onPress={()=>orderDeliver(item.email)} />
            </View>
            </View>
            <View style={{width:150, marginLeft:100}}>
            <Button title="Chat" onPress={()=>navigation.navigate('Chat',{name: chatName, email: chatEmail, riderEmail: RiderEmail, customerToken:customToken})} />
            </View>
            </View>
         )
         }}
 />
        
    )
}