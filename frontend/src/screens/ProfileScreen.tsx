import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../services/AuthContext';
import { COLORS } from '../utils/constants';
import { ScreenHeader } from './shared';
export default function ProfileScreen({ navigation }: any){ const {user,logout}=useAuth(); return <View style={styles.container}><ScreenHeader title="Profile" back navigation={navigation}/><View style={styles.avatar}><Text style={styles.initial}>{user?.name?.[0]??'U'}</Text></View><Text style={styles.name}>{user?.name}</Text><Text style={styles.email}>{user?.email}</Text><Text style={styles.email}>Role: {user?.role}</Text><TouchableOpacity style={styles.btn} onPress={logout}><Text style={styles.btnText}>Logout</Text></TouchableOpacity></View>}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:COLORS.background},avatar:{alignSelf:'center',marginTop:30,width:80,height:80,borderRadius:40,backgroundColor:COLORS.green,alignItems:'center',justifyContent:'center'},initial:{color:'#fff',fontSize:36,fontWeight:'900'},name:{color:'#fff',textAlign:'center',fontSize:22,fontWeight:'900',marginTop:12},email:{color:COLORS.textMuted,textAlign:'center',fontWeight:'700',marginTop:5},btn:{margin:24,height:46,borderRadius:10,alignItems:'center',justifyContent:'center',backgroundColor:COLORS.red},btnText:{color:'#fff',fontWeight:'900'}});
