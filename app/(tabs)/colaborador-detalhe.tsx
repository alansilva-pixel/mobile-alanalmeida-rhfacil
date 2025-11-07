import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import api from "../../services/API";

interface Colaborador {
  cpf: string;
  nome: string;
  cargo: string;
  salario: number;
  criadoEm?: string;
}

export default function ColaboradorDetalhe() {
  const { cpf } = useLocalSearchParams();
  const router = useRouter();
  const [colaborador, setColaborador] = useState<Colaborador | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const fetchColaborador = async () => {
      try {
        if (!cpf) {
          setErro("CPF não informado");
          setLoading(false);
          return;
        }

        console.log("Buscando colaborador:", cpf);
        const response = await api.get(`/colaboradores/${cpf}`);
        setColaborador(response.data);
      } catch (error) {
        console.error("Erro ao buscar colaborador:", error);
        setErro("Erro ao carregar colaborador.");
      } finally {
        setLoading(false);
      }
    };

    fetchColaborador();
  }, [cpf]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  if (erro || !colaborador) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{erro || "Colaborador não encontrado."}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.voltar}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{colaborador.nome}</Text>
      <Text style={styles.text}>CPF: {colaborador.cpf}</Text>
      <Text style={styles.text}>Cargo: {colaborador.cargo}</Text>
      <Text style={styles.text}>Salário: R$ {colaborador.salario}</Text>
      <Text style={styles.text}>
        Data de criação: {new Date(colaborador.criadoEm ?? "").toLocaleDateString("pt-BR")}
      </Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Gerar Holerite (PDF)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Controle de Ponto</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.voltar}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8fafc" },
  title: { fontSize: 24, fontWeight: "bold", color: "#1d4ed8", marginBottom: 10 },
  text: { fontSize: 16, marginVertical: 3 },
  button: { backgroundColor: "#2563eb", padding: 12, borderRadius: 8, marginVertical: 10 },
  buttonText: { color: "white", textAlign: "center", fontWeight: "600" },
  voltar: { color: "#2563eb", textAlign: "center", marginTop: 10 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "red", marginBottom: 10 },
});
