import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#121212", // Black background
      
    },
    elevatedCard: {
      backgroundColor: "#1e1e1e",
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 6,
      marginVertical: 5,
      padding: 17,
    },
    heading: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      color: "#ff4d4d", // Red heading
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.7)",
    },
    transactionImage: {
      color:"#fff",
      width: 100,
      height: 100,
      marginTop: 10,
      alignSelf: "center",
    },
    imageButton: {
      backgroundColor: "#1e1e1e",
      padding: 10,
      borderRadius: 5,
      alignItems: "center",
      borderWidth:1,
      borderColor:"#ff4d4d",
      margin:12
    },
    modalContent: {
      backgroundColor: "#1e1e1e",
      padding: 20,
      borderRadius: 10,
      width: "80%",
    },
    modalHeading: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#ff4d4d",
      marginBottom: 10,
    },
  
    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: 10,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ff4d4d", // Red separator line
    },
    label: {
      fontWeight: "bold",
      color: "#ff4d4d", // Red labels
    },
    value: {
      fontSize: 16,
      color: "#fff", // White values
    },
    input: {
      backgroundColor: "#1e1e1e",
      color: "#fff",
      padding: 5,
      borderRadius: 5,
      width: "50%",
      borderWidth:1,
      borderColor: "#ff4d4d",
      marginVertical:4
    },
    actions: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 20,
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: "#1e1e1e",
  
      borderRadius: 5,
      borderWidth: 1,
      borderColor: "#ff4d4d",
    },
    buttonText: {
      color: "#ff4d4d",
      fontWeight: "bold",
      marginHorizontal:3
    },
    buttonPressed: {
      backgroundColor: "#ff4d4d",
    },
    optionBtn:{
      flexDirection:"row",
      justifyContent:'space-between'
    },
    imgBox:{
      flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    }
  });

export default styles;