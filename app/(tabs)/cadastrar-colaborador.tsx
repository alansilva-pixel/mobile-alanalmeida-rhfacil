import api from "@/services/API";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";

export default function CadastrarColaborador() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [cargo, setCargo] = useState("");
  const [salario, setSalario] = useState("");
  const router = useRouter();

  const handleCadastrar = async () => {
    if (!nome || !cpf) {
      Alert.alert("Atenção", "Nome e CPF são obrigatórios!");
      return;
    }

    try {
      const novoColaborador = {
        nome,
        cpf,
        cargo,
        salario: salario ? Number(salario) : 0,
      };

      await api.post("/colaboradores", novoColaborador);

      Alert.alert("Sucesso", "Colaborador cadastrado com sucesso!");
      setNome("");
      setCpf("");
      setCargo("");
      setSalario("");
      router.push("/(tabs)/lista-colaboradores");
    } catch (error) {
      console.error("Erro ao cadastrar colaborador:", error);
      Alert.alert("Erro", "Não foi possível cadastrar o colaborador.");
    }
  };

  return (
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Cadastrar Colaborador</Text>

        <TextInput
          placeholder="Nome completo"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />

        <TextInput
          placeholder="CPF"
          value={cpf}
          onChangeText={setCpf}
          style={styles.input}
        />

        <TextInput
          placeholder="Cargo"
          value={cargo}
          onChangeText={setCargo}
          style={styles.input}
        />

        <TextInput
          placeholder="Salário"
          value={salario}
          onChangeText={setSalario}
          keyboardType="numeric"
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleCadastrar}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scroll: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#1e90ff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
