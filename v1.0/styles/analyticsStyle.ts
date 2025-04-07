import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#121212",
      padding: 16,
    },
    section: {
      marginBottom: 24,
      padding: 16,
      borderRadius: 8,
      backgroundColor: "#1e1e1e",
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
    },
    heading: {
      color: "#e74c3c",
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 8,
    },
    placeholder: {
      color: "#aaa",
      fontSize: 14,
      fontStyle: "italic",
    },
    chart: {
      marginVertical: 8,
      borderRadius: 8,
    },
    button: {
      marginTop: 10,
      padding: 10,
      borderRadius: 8,
      backgroundColor: "#e74c3c",
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontWeight: "600",
    },
    tip: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 4,
    },
    bullet: {
      color: "#e74c3c",
      marginRight: 8,
      fontSize: 20,
    },
    tipText: {
      color: "#aaa",
      fontSize: 14,
    },
    chartCard: {
      backgroundColor: "#1A1A1A",
      borderRadius: 16,
      padding: 12,
      marginHorizontal: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    }
    
  });

export default styles;