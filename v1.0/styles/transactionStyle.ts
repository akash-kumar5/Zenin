import { StyleSheet } from "react-native";

const transactionStyle = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Dark overlay for better focus
  },
  modalContent: {
    backgroundColor: "#1e1e1e",
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5, // Adds shadow
    color:"#fff"
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color:"#e74c3c"
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: "100%",
    alignItems: "center",
    color:"#fff",
    borderBottomWidth :1,
    borderColor:"#e74c3c"
  },
  optionPressed: {
    backgroundColor: "#f0f0f0", // Light gray on press
  },
  optionText: {
    fontSize: 16,
    color:"#fff"
  },
  activeFilter: {
    backgroundColor: "#e74c3c",
    color: "#1e1e1e",
  },
  container: {
    flex: 1,
    backgroundColor: "#121212",
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
  },
  summarySection: {
    marginBottom: 4,
    padding: 16,
    flexShrink:0
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingHorizontal:8
  },
  summaryBox: {
    alignItems: "center",
  },
  summaryAmount: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  summaryLabel: {
    color: "#aaa",
    fontSize: 12,
  },
  section: {
    marginBottom: 4,
    padding: 16,
    flex:1
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
    padding: 2,
  },
  headerIcons: {
    flexDirection: "row",
  },
  heading: {
    color: "#e74c3c",
    fontSize: 20,
    fontWeight: "600",
    marginRight: 8,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: "#e74c3c",
    backgroundColor: "#333",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    color: "#fff",
    fontSize: 14,
  },
  transaction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 12,
  },
  transactionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  transactionDate: {
    color: "#aaa",
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default transactionStyle;
