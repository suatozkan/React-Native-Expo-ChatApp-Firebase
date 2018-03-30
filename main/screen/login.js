import React,{Component} from 'react';
import  firebase from 'firebase'
import { StyleSheet, Text, View,TouchableOpacity,ActivityIndicator } from 'react-native';
import {NavigationActions} from 'react-navigation'

import Icon from '@expo/vector-icons/FontAwesome'

export default class Login extends Component {

  state={
    showSpinner:true,
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged(auth=>{
      if(auth){
        this.firebaseRef=firebase.database().ref('users')
        this.firebaseRef.child(auth.uid).on('value',snap=>{
          const user=snap.val()
          if(user!=null){
            this.firebaseRef.child(auth.uid).off('value')
            this.goHome(user)
          }
        })
      } else {
        this.setState({showSpinner:false})
      }
    })

  }

  goHome(user){

    const resetAction= NavigationActions.reset({
      index:0,
      actions:[
        NavigationActions.navigate({routeName:'Home',params:{user}}),
      ],
    })
    this.props.navigation.dispatch(resetAction)
  }

  authenticate=(token)=>{
    const provider= firebase.auth.FacebookAuthProvider
    const credential= provider.credential(token)
    return firebase.auth().signInWithCredential(credential)
  }

  createUser= (uid,userData) =>{
    const defaults={
      uid,
    }
    firebase.database().ref('users').child(uid).update({...userData,...defaults})
  }

  login= async () => {
    this.setState({showSpinner:true})
    const ADD_ID='1701875583376164'
    const options={
      permissions:['public_profile'],
    }
    const {type,token} = await Expo.Facebook.logInWithReadPermissionsAsync(ADD_ID,options)
    if(type==='success'){
      const fields=['id','first_name',]
      const response= await fetch (`https://graph.facebook.com/me?fields=${fields.toString()}&access_token=${token}`)
      const userData= await response.json()
      const {uid} = await this.authenticate(token)

      this.createUser(uid,userData)

    } else {
      this.setState({showSpinner:false})
    }

  }


  render() {
    return (
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
      {
        this.state.showSpinner ?
        <ActivityIndicator animating={true} size="large" color="black" /> :
        <View>
          <Text style={{color:'grey',fontWeight:'bold',fontSize:24,paddingBottom:30,backgroundColor:'transparent',}}> Great App</Text>
          <TouchableOpacity onPress={()=> this.login()}>
          <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'blue',flexDirection:'row',borderRadius:8,borderWidth:1,borderColor:'transparent'}}>
          <Icon name={'facebook-f'} size={20} color={'white'} style={{paddingLeft:20}}/>
          <Text style={{color:'white',padding:20,backgroundColor:'transparent'}}>Facebook</Text>
          </View>
          </TouchableOpacity>
        </View>
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({

});
