import React from "react";
import { Image, StyleSheet, View } from "react-native";


const Logo = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 50, // or wherever you want it
  },
  logo: {
    width: 150,
    height: 150,
  },
});

export default Logo;
