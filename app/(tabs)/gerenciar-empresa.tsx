import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import api from "../../services/API";

export default function GerenciarEmpresa() {
  const [balanco, setBalanco] = useState({
    totalColaboradores: 0,
    totalSalarios: 0,
    mediaSalarial: 0,
  });
  const [novoCargo, setNovoCargo] = useState("");
  const [cargos, setCargos] = useState<string[]>([]);

  useEffect(() => {
    api
      .get("/empresa/balanco")
      .then((res) => setBalanco(res.data))
      .catch(() => setBalanco({ totalColaboradores: 0, totalSalarios: 0, mediaSalarial: 0 }));

    setCargos(["Desenvolvedor", "Designer", "Gerente"]);
  }, []);

  async function handleAdicionarCargo() {
    if (!novoCargo) return Alert.alert("Aviso", "Informe o nome do cargo");

    setCargos((prev) => [...prev, novoCargo]);
    setNovoCargo("");
    Alert.alert("Sucesso", "Cargo cadastrado localmente!");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Empresa</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Balanço Geral</Text>
        <Text style={styles.value}>Total de colaboradores: {balanco.totalColaboradores}</Text>
        <Text style={styles.value}>Folha total: R$ {balanco.totalSalarios.toFixed(2)}</Text>
        <Text style={styles.value}>Média salarial: R$ {balanco.mediaSalarial.toFixed(2)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💼 Cargos Cadastrados</Text>
        <FlatList
          data={cargos}
          keyExtractor={(item) => item}
          renderItem={({ item }) => <Text style={styles.cargoItem}>• {item}</Text>}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Novo cargo"
        value={novoCargo}
        onChangeText={setNovoCargo}
      />
      <TouchableOpacity style={styles.button} onPress={handleAdicionarCargo}>
        <Text style={styles.buttonText}>Cadastrar Cargo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.recruitment}>
        <Text style={styles.recruitmentText}>📋 Recrutamento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8fafc" },
  title: { fontSize: 24, fontWeight: "bold", color: "#1d4ed8", marginBottom: 20 },
  section: { marginVertical: 10 },
  sectionTitle: { fontWeight: "bold", fontSize: 18 },
  value: { fontSize: 16, color: "#1e293b", marginTop: 5 },
  cargoItem: { fontSize: 15, marginVertical: 3, color: "#475569" },
  input: { backgroundColor: "white", borderRadius: 8, padding: 10, marginVertical: 8 },
  button: { backgroundColor: "#2563eb", padding: 15, borderRadius: 10, marginTop: 10 },
  buttonText: { color: "white", fontWeight: "bold", textAlign: "center" },
  recruitment: { marginTop: 20 },
  recruitmentText: { color: "#64748b", fontStyle: "italic", textAlign: "center" },
});
