import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function WebApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📱 Privatni časovi</Text>
      <Pressable
        onPress={() =>
          window.location.href = "https://apk-link-site.vercel.app/app-latest.apk"
        }
        style={styles.button}
      >
        <Text style={styles.buttonText}>⬇️ Preuzmi Android Aplikaciju</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 30
  },
  button: {
    backgroundColor: "#f472b6",
    padding: 15,
    borderRadius: 8
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold"
  }
});
