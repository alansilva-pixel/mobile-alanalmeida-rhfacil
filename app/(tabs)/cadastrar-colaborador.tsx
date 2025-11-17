import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import api from "../../services/API";

interface Cargo {
  id: string;
  nome: string;
  salario: number;
}

export default function CadastrarColaborador() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [pis, setPis] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [bonus, setBonus] = useState("");
  const [auxilios, setAuxilios] = useState("");
  const [foto, setFoto] = useState<string | null>(null);

  const [cargoId, setCargoId] = useState("");
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loadingCargos, setLoadingCargos] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCargos();
  }, []);

  async function fetchCargos() {
    setLoadingCargos(true);
    try {
      const res = await api.get("/lambdaCargos"); // use /lambdaCargos se sua rota for essa
      setCargos(res.data || []);
    } catch (err) {
      console.error("Erro ao buscar cargos:", err);
      setCargos([]);
    } finally {
      setLoadingCargos(false);
    }
  }

  function validarCPF(cpf: string) {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
  }

  async function escolherFoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {
      setFoto(result.assets[0].base64 || null);
    }
  }

  async function handleCadastrar() {
    if (!nome || !cpf || !cargoId) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    if (!validarCPF(cpf)) {
      Alert.alert("Erro", "CPF inválido.");
      return;
    }

    const cargoSelecionado = cargos.find((c) => c.id === cargoId);
    if (!cargoSelecionado) {
      Alert.alert("Erro", "Cargo inválido. Atualize e tente novamente.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/colaboradores", {
        nome,
        cpf,
        nascimento,
        pis,
        telefone,
        email,
        bonus: Number(bonus) || 0,
        auxilios: Number(auxilios) || 0,
        cargoId,
        cargoNome: cargoSelecionado.nome,
        cargoSalario: cargoSelecionado.salario,
        foto,
      });

      Alert.alert("Sucesso", "Colaborador cadastrado com sucesso!");
      // limpa campos
      setNome("");
      setCpf("");
      setNascimento("");
      setPis("");
      setTelefone("");
      setEmail("");
      setBonus("");
      setAuxilios("");
      setCargoId("");
      setFoto(null);
    } catch (error) {
      console.error("Erro ao cadastrar colaborador:", error);
      Alert.alert("Erro", "Não foi possível cadastrar o colaborador.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cadastrar Novo Colaborador</Text>

      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} placeholderTextColor={"#999"} />
      <TextInput style={styles.input} placeholder="CPF" keyboardType="numeric" value={cpf} onChangeText={setCpf} placeholderTextColor={"#999"} />
      <TextInput style={styles.input} placeholder="Data de Nascimento (AAAA-MM-DD)" value={nascimento} onChangeText={setNascimento} placeholderTextColor={"#999"} />
      <TextInput style={styles.input} placeholder="PIS/PASEP" keyboardType="numeric" value={pis} onChangeText={setPis} placeholderTextColor={"#999"} />
      <TextInput style={styles.input} placeholder="Telefone" keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} placeholderTextColor={"#999"} />
      <TextInput style={styles.input} placeholder="E-mail" keyboardType="email-address" value={email} onChangeText={setEmail} placeholderTextColor={"#999"} />
      <TextInput style={styles.input} placeholder="Bônus (R$)" keyboardType="numeric" value={bonus} onChangeText={setBonus} placeholderTextColor={"#999"} />
      <TextInput style={styles.input} placeholder="Auxílios (R$)" keyboardType="numeric" value={auxilios} onChangeText={setAuxilios} placeholderTextColor={"#999"} />

      <Text style={styles.label}>Selecione o Cargo:</Text>

      <View style={styles.pickerContainer}>
        {loadingCargos ? (
          <ActivityIndicator />
        ) : (
          <Picker selectedValue={cargoId} onValueChange={(value) => setCargoId(value)}>
            <Picker.Item label="Selecione um cargo" value="" />
            {cargos.map((cargo) => (
              <Picker.Item
                key={cargo.id}
                label={`${cargo.nome} — R$ ${Number(cargo.salario ?? 0).toFixed(2)}`}
                value={cargo.id}
              />
            ))}
          </Picker>
        )}
      </View>

      <TouchableOpacity style={styles.fotoButton} onPress={escolherFoto}>
        <Text style={styles.buttonText}>Selecionar Foto</Text>
      </TouchableOpacity>

      {foto && <Image source={{ uri: `data:image/jpeg;base64,${foto}` }} style={styles.preview} />}

      <TouchableOpacity style={[styles.button, submitting && { opacity: 0.7 }]} onPress={handleCadastrar} disabled={submitting}>
        <Text style={styles.buttonText}>{submitting ? "Enviando..." : "Cadastrar Colaborador"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8fafc" },
  title: { fontSize: 22, fontWeight: "bold", color: "#1d4ed8", marginBottom: 20, textAlign: "center" },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  label: { marginTop: 10, fontWeight: "bold" },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  fotoButton: {
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  button: { backgroundColor: "#1d4ed8", padding: 15, borderRadius: 10, marginTop: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  preview: { width: 100, height: 100, borderRadius: 8, alignSelf: "center", marginTop: 10 },
});
