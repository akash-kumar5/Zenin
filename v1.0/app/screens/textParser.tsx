import React, { useState } from 'react'
import { View, TextInput, Button, Text, ScrollView } from 'react-native'
import { isFinancialMessage, parseMessage, saveParsedTransaction } from '@/utils/messageParser'
import { useAuth } from '@/services/AuthContext'

export default function TestParser() {
  const {user} = useAuth();
  const [msg, setMsg] = useState('')
  const [result, setResult] = useState<any>(null)

  const handleTest = () => {

    if (isFinancialMessage(msg)) {
      setResult('a financial message')
      console.log("a financial msg");
      
      // return
    }
    const parsed = parseMessage(msg)
    console.log("parsed",parsed);
    
    if (!parsed) {
      setResult('⚠️ Failed to parse')
      return
    }
    setResult(parsed)
    saveParsedTransaction(user.uid,parsed)
  }

  return (
    <ScrollView style={{ padding: 40 }}>
      <TextInput
        placeholder="Paste SMS/notification here"
        value={msg}
        onChangeText={setMsg}
        style={{
          borderColor: 'gray',
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
        multiline
      />
      <Button title="Test Parser" onPress={handleTest} />
      <Text style={{ marginTop: 20 }}>{typeof result === 'string' ? result : JSON.stringify(result, null, 2)}</Text>
    </ScrollView>
  )
}
