import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import api from "../../services/API";

interface Colaborador {
  cpf: string;
  nome: string;
  cargoNome: string;
  cargoSalario: number;
  criadoEm?: string;
  email: string;
  nascimento: string;
  pis: string;
  telefone: string;
  bonus: number;
  auxilios: number;
}

export default function ColaboradorDetalhe() {
  const { cpf } = useLocalSearchParams();
  const router = useRouter();
  const [colaborador, setColaborador] = useState<Colaborador | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const fetchColaborador = useCallback(async () => {
    try {
      if (!cpf) {
        setErro("CPF não informado");
        setLoading(false);
        return;
      }

      console.log("Buscando colaborador:", cpf);
      setLoading(true);
      setErro(null);
      const response = await api.get(`/colaboradores/${cpf}`);
      setColaborador(response.data);
    } catch (error) {
      console.error("Erro ao buscar colaborador:", error);
      setErro("Erro ao carregar colaborador.");
    } finally {
      setLoading(false);
    }
  }, [cpf]);

  useFocusEffect(
    useCallback(() => {
      fetchColaborador();
    }, [fetchColaborador])
  );

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
      <Text style={styles.text}>Cargo: {colaborador.cargoNome}</Text>
      <Text style={styles.text}>Salário R$: {colaborador.cargoSalario.toFixed(2)}</Text>
      <Text style={styles.text}>Bônus R$: {(colaborador.bonus || 0).toFixed(2)}</Text>
      <Text style={styles.text}>Auxílios R$: {(colaborador.auxilios || 0).toFixed(2)}</Text>
      <Text style={styles.text}>E-mail: {colaborador.email}</Text>
      <Text style={styles.text}>Nascimento:{colaborador.nascimento}</Text>
      <Text style={styles.text}>Pis: {colaborador.pis}</Text>
      <Text style={styles.text}>Telefone: {colaborador.telefone}</Text>
      <Text style={styles.text}>
        Data de criação: {new Date(colaborador.criadoEm ?? "").toLocaleDateString("pt-BR")}
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#f59e0b" }]}
        onPress={() => router.push({
          pathname: "/(tabs)/editar-colaborador",
          params: { cpf: colaborador.cpf }
        })}
      >
        <Text style={styles.buttonText}>Editar Colaborador</Text>
      </TouchableOpacity>

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
