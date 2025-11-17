import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../services/API";

interface Cargo {
  id: string;
  nome: string;
  salario: number;
}

export default function GerenciarEmpresa() {
  const [balanco, setBalanco] = useState({
    totalColaboradores: 0,
    totalSalarios: 0,
    mediaSalarial: 0,
  });

  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [novoCargo, setNovoCargo] = useState("");
  const [salario, setSalario] = useState("");
  const [loadingCargos, setLoadingCargos] = useState(false);

  useEffect(() => {
    buscarBalanco();
    buscarCargos();
  }, []);

  async function buscarBalanco() {
    try {
      const res = await api.get("/empresa/balanco");
      setBalanco(res.data);
    } catch (err) {
      setBalanco({ totalColaboradores: 0, totalSalarios: 0, mediaSalarial: 0 });
    }
  }

  async function buscarCargos() {
    setLoadingCargos(true);
    try {
      const res = await api.get("/lambdaCargos");
      setCargos(res.data || []);
    } catch (err) {
      console.error("Erro ao buscar cargos:", err);
      setCargos([]);
    } finally {
      setLoadingCargos(false);
    }
  }

  async function handleAdicionarCargo() {
    if (!novoCargo || !salario) {
      return Alert.alert("Aviso", "Informe o nome e o salário do cargo");
    }

    try {
      const novo = { nome: novoCargo, salario: parseFloat(salario) };
      await api.post("/lambdaCargos", novo); 
      setNovoCargo("");
      setSalario("");
      await buscarCargos();
      Alert.alert("Sucesso", "Cargo cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar cargo:", error);
      Alert.alert("Erro", "Não foi possível cadastrar o cargo.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Empresa</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Balanço Geral</Text>
        <Text style={styles.value}>
          Total de colaboradores: {balanco.totalColaboradores ?? 0}
        </Text>
        <Text style={styles.value}>
          Folha total: R$ {(balanco.totalSalarios ?? 0).toFixed(2)}
        </Text>
        <Text style={styles.value}>
          Média salarial: R$ {(balanco.mediaSalarial ?? 0).toFixed(2)}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💼 Cargos Cadastrados</Text>

        {loadingCargos ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={cargos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Text style={styles.cargoItem}>
                • {item.nome} — R$ {(item.salario ?? 0).toFixed(2)}
              </Text>
            )}
            ListEmptyComponent={
              <Text style={{ color: "#94a3b8", fontStyle: "italic" }}>
                Nenhum cargo cadastrado.
              </Text>
            }
          />
        )}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Nome do cargo"
        value={novoCargo}
        onChangeText={setNovoCargo}
        placeholderTextColor={"#999"}
      />
      <TextInput
        style={styles.input}
        placeholder="Salário base (ex: 3500)"
        keyboardType="numeric"
        value={salario}
        onChangeText={setSalario}
        placeholderTextColor={"#999"}
      />

      <TouchableOpacity style={styles.button} onPress={handleAdicionarCargo}>
        <Text style={styles.buttonText}>Cadastrar Cargo</Text>
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
  input: { backgroundColor: "white", borderRadius: 8, padding: 10, marginVertical: 8, borderWidth:1, borderColor:"#cbd5e1" },
  button: { backgroundColor: "#2563eb", padding: 15, borderRadius: 10, marginTop: 10 },
  buttonText: { color: "white", fontWeight: "bold", textAlign: "center" },
});
