import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
    App: {
        flex: 1,
        backgroundColor: '#e5e5e5',
        paddingTop: Platform.OS === 'android' ? 25 : 0
      },
      actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
      },
      TopTitle: {
          height: 70,
          backgroundColor: "#00897B",
          paddingLeft: 40,
          paddingTop: 20
      },
      TopTextTitle : {
          color: "white",
          fontSize: 20,
          textTransform : 'uppercase'
      },
      container : {
          flex: 1
      },
    card: {
        borderRadius: Platform.OS === 'android' ? 5.00 : 5
    }
});