import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function SobreScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sobre o RHFácil</Text>
      <Text style={styles.text}>
        O RHFácil é um aplicativo que facilita o gerenciamento de recursos humanos,
        com foco em empresas de pequeno e médio porte.
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 16, textAlign: "center", color: "#444", marginBottom: 20 },
  button: { backgroundColor: "#2563eb", padding: 10, borderRadius: 8 },
  buttonText: { color: "white", fontWeight: "600" },
});
