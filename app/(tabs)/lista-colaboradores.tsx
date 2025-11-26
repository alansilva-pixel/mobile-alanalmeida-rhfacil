import api from "@/services/API";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Colaborador {
  cpf: string;
  nome: string;
  cargo: string;
  salario: number;
  criadoEm?: string;
  bonus: number;
  auxilios: number;
}

export default function ListaColaboradores() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const buscarColaboradores = async () => {
      try {
        const response = await api.get("/colaboradores");
        setColaboradores(response.data);
      } catch (error) {
        console.error("Erro ao buscar colaboradores:", error);
        setErro("Erro ao carregar lista de colaboradores.");
      } finally {
        setLoading(false);
      }
    };
    buscarColaboradores();
  }, []);

  const renderItem = ({ item }: { item: Colaborador }) => {
    const bonus = item.bonus || 0;
    const auxilios = item.auxilios || 0;
    const totalGanhos = item.salario + bonus + auxilios;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/colaborador-detalhe",
            params: { cpf: item.cpf },
          })
        }
      >
        <Text style={styles.name}>{item.nome}</Text>
        <Text style={styles.role}>Cargo: {item.cargo}</Text>
        <Text style={styles.salary}>
          Ganhos Totais: R$ {totalGanhos.toFixed(2)}
        </Text>
        <Text style={styles.date}>
          Cadastrado em: {new Date(item.criadoEm ?? "").toLocaleDateString("pt-BR")}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text>Carregando colaboradores...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{erro}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Colaboradores</Text>

      <FlatList
        data={colaboradores}
        keyExtractor={(item) => item.cpf}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Nenhum colaborador encontrado.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  role: {
    fontSize: 16,
    color: "#555",
    marginTop: 4,
  },
  salary: {
    fontSize: 16,
    color: "#333",
    marginTop: 4,
    fontWeight: "300",
  },
  salaryDetail: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  date: {
    fontSize: 14,
    color: "#888",
    marginTop: 6,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
