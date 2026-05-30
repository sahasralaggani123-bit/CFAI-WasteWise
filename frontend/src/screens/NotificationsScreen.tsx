import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { api } from '../services/api';
import { useAuth } from '../services/AuthContext';
import { COLORS } from '../utils/constants';
import { ScreenHeader } from './shared';
export default function NotificationsScreen({ navigation }: any){ const {token}=useAuth(); const [items,setItems]=useState<any[]>([]); useEffect(()=>{api.getNotifications(token??'').then(r=>setItems(r.notifications))},[token]); return <ScrollView style={styles.container}><ScreenHeader title="Notifications" back navigation={navigation}/>{items.map(n=><View key={n.id} style={[styles.card,n.unread&&styles.unread]}><View style={styles.row}><Text style={styles.title}>{n.title}</Text><Text style={styles.time}>{n.time}</Text></View><Text style={styles.body}>{n.body}</Text></View>)}</ScrollView>}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:COLORS.background},card:{marginHorizontal:18,marginTop:10,padding:13,borderRadius:7,backgroundColor:'#20221f',borderLeftWidth:3,borderLeftColor:COLORS.green},unread:{backgroundColor:'#edf8f0'},row:{flexDirection:'row',justifyContent:'space-between'},title:{color:'#fff',fontWeight:'900'},time:{color:COLORS.textMuted,fontWeight:'800',fontSize:11},body:{color:COLORS.textMuted,fontWeight:'700',marginTop:7,lineHeight:18},});
