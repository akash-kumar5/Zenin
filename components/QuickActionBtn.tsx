import React from "react";
import { Pressable, Text } from "react-native";


const QuickActionButton = ({ title, onPress }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed ? "#e74c3c" : "transparent",
          shadowOpacity: pressed ? 0 : 0.1, // subtle shadow only when not pressed
        },
      ]}
    >
      {({ pressed }) => (
        <Text style={[styles.text, { color: pressed ? "#fff" : "#e74c3c" }]}>
          {title}
        </Text>
      )}
    </Pressable>
  );

const styles = {
    button: {
        borderWidth: 1.5,
        borderColor: "#e74c3c",
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 20,
        minWidth: 130,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
        text: {
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "center",
        },
    }

  export default QuickActionButton;