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
      marginVertical: 12,
      borderRadius: 16,
    },
    
    centerLabel: {
      position: 'absolute',
      top: 100,
      left: '50%',
      transform: [{ translateX: -50 }],
      alignItems: 'center',
    },
    
    centerAmount: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFF',
    },
    
    centerText: {
      fontSize: 12,
      color: '#AAA',
    },
    
    legendContainer: {
      marginTop: 12,
      paddingHorizontal: 16,
    },
    
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    
    legendColorBox: {
      width: 12,
      height: 12,
      borderRadius: 4,
      marginRight: 8,
    },
    
    legendText: {
      color: '#E4E4E4',
      fontSize: 13,
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