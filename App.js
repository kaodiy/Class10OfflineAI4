import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, Pressable, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import knowledge from "./assets/knowledge.json";

const typoMap = {
  photosinthesis:"photosynthesis", photosynthsis:"photosynthesis",
  democrcy:"democracy", trignometry:"trigonometry",
  curent:"current", fedaralism:"federalism",
  "passive voise":"passive voice", "reproted speech":"reported speech"
};

function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9²⁺⁻ ]/g," ").replace(/\s+/g," ").trim();
}
function distance(a,b) {
  const d=Array.from({length:a.length+1},(_,i)=>[i]);
  for(let j=0;j<=b.length;j++) d[0][j]=j;
  for(let i=1;i<=a.length;i++) for(let j=1;j<=b.length;j++)
    d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));
  return d[a.length][b.length];
}
function similarity(a,b) {
  if(!a||!b) return 0;
  return 1-distance(a,b)/Math.max(a.length,b.length);
}
function answerQuestion(question) {
  let q=normalize(question);
  for(const [bad,good] of Object.entries(typoMap)) q=q.replaceAll(bad,good);
  const words=q.split(" ").filter(Boolean);
  let best=null,bestScore=0;
  for(const item of knowledge){
    const hay=normalize([item.topic,...item.keywords,item.answer].join(" "));
    const overlap=words.reduce((n,w)=>n+(hay.includes(w)?1:0),0);
    const score=(overlap/Math.max(1,words.length))*0.75+similarity(q,normalize(item.topic))*0.25;
    if(score>bestScore){bestScore=score;best=item;}
  }
  return best && bestScore>=0.16
    ? `${best.answer}\n\n[${best.subject} • ${best.topic}]`
    : "I don't have that topic in my offline knowledge pack yet. Try another wording or add the topic to assets/knowledge.json.";
}

export default function App(){
  const [messages,setMessages]=useState([{id:"welcome",role:"assistant",text:"Hi! I'm your offline Class 10 tutor. Ask a Maths, Science, Social Science or English question."}]);
  const [input,setInput]=useState("");
  const send=()=>{
    const q=input.trim(); if(!q)return;
    const user={id:Date.now()+"u",role:"user",text:q};
    setMessages(m=>[...m,user,{id:Date.now()+"a",role:"assistant",text:answerQuestion(q)}]);
    setInput("");
  };
  return <SafeAreaView style={styles.safe}>
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS==="ios"?"padding":undefined}>
      <View style={styles.header}><Text style={styles.title}>Class 10 Offline AI</Text><Text style={styles.subtitle}>Local knowledge • no cloud AI calls</Text></View>
      <FlatList data={messages} keyExtractor={x=>x.id} contentContainerStyle={styles.list}
        renderItem={({item})=><View style={[styles.bubble,item.role==="user"?styles.user:styles.assistant]}><Text style={styles.bubbleText}>{item.text}</Text></View>}/>
      <View style={styles.inputRow}>
        <TextInput value={input} onChangeText={setInput} onSubmitEditing={send} placeholder="Ask a Class 10 question..." placeholderTextColor="#777" style={styles.input} multiline/>
        <Pressable onPress={send} style={styles.send}><Text style={styles.sendText}>Send</Text></Pressable>
      </View>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
const styles=StyleSheet.create({
 safe:{flex:1,backgroundColor:"#f4f7fb"},container:{flex:1},
 header:{padding:18,backgroundColor:"#fff",borderBottomWidth:1,borderBottomColor:"#dde3ea"},
 title:{fontSize:23,fontWeight:"800",color:"#16202a"},subtitle:{marginTop:4,fontSize:12,color:"#66717d"},
 list:{padding:14,paddingBottom:8},bubble:{maxWidth:"88%",padding:12,borderRadius:16,marginBottom:10},
 user:{alignSelf:"flex-end",backgroundColor:"#dceeff",borderBottomRightRadius:4},
 assistant:{alignSelf:"flex-start",backgroundColor:"#fff",borderBottomLeftRadius:4,borderWidth:1,borderColor:"#e1e6ec"},
 bubbleText:{fontSize:15,lineHeight:21,color:"#17212b"},
 inputRow:{flexDirection:"row",alignItems:"flex-end",padding:10,backgroundColor:"#fff",borderTopWidth:1,borderTopColor:"#dde3ea"},
 input:{flex:1,minHeight:46,maxHeight:110,borderWidth:1,borderColor:"#cbd3dc",borderRadius:14,paddingHorizontal:13,paddingVertical:10,fontSize:15,color:"#17212b"},
 send:{marginLeft:8,paddingHorizontal:15,paddingVertical:14,borderRadius:14,backgroundColor:"#1d4ed8"},sendText:{color:"#fff",fontWeight:"700"}
});
