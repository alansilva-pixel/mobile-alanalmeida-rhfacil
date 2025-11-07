import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RHFácil</Text>
      <Text style={styles.subtitle}>Gestão de RH simples e moderna</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/cadastrar-colaborador")}
      >
        <Text style={styles.buttonText}>Cadastrar Novo Colaborador</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/lista-colaboradores")}
      >
        <Text style={styles.buttonText}>Lista de Colaboradores</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/gerenciar-empresa")}
      >
        <Text style={styles.buttonText}>Gerenciar Empresa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f1f5f9" },
  title: { fontSize: 32, fontWeight: "bold", color: "#1d4ed8" },
  subtitle: { fontSize: 16, color: "#475569", marginBottom: 30 },
  button: { backgroundColor: "#2563eb", padding: 15, borderRadius: 12, width: "80%", marginVertical: 10 },
  buttonText: { color: "white", textAlign: "center", fontSize: 16, fontWeight: "600" },
});
