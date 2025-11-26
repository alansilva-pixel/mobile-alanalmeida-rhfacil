import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import api from "../../services/API";

interface Cargo {
    id: string;
    nome: string;
    salario: number;
}

export default function EditarColaborador() {
    const { cpf } = useLocalSearchParams();
    const router = useRouter();

    const [nome, setNome] = useState("");
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
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchColaborador();
        fetchCargos();
    }, []);

    async function fetchColaborador() {
        try {
            const response = await api.get(`/colaboradores/${cpf}`);
            const data = response.data;

            setNome(data.nome || "");
            // Converte data de AAAA-MM-DD para DD/MM/AAAA ao carregar
            setNascimento(converterISOParaBR(data.nascimento || ""));
            setPis(data.pis || "");
            setTelefone(data.telefone || "");
            setEmail(data.email || "");
            setBonus(data.bonus?.toString() || "0");
            setAuxilios(data.auxilios?.toString() || "0");
            setCargoId(data.cargoId || "");
            setFoto(data.foto || null);
        } catch (error) {
            console.error("Erro ao buscar colaborador:", error);
            Alert.alert("Erro", "Não foi possível carregar os dados do colaborador.");
            router.back();
        } finally {
            setLoading(false);
        }
    }

    async function fetchCargos() {
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

    function formatarData(texto: string) {
        const numeros = texto.replace(/\D/g, "");

        if (numeros.length <= 2) {
            return numeros;
        } else if (numeros.length <= 4) {
            return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
        } else {
            return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4, 8)}`;
        }
    }

    function converterDataParaISO(dataBR: string): string {
        const numeros = dataBR.replace(/\D/g, "");
        if (numeros.length === 8) {
            const dia = numeros.slice(0, 2);
            const mes = numeros.slice(2, 4);
            const ano = numeros.slice(4, 8);
            return `${ano}-${mes}-${dia}`;
        }
        return "";
    }

    function converterISOParaBR(dataISO: string): string {
        if (!dataISO) return "";
        const partes = dataISO.split("-");
        if (partes.length === 3) {
            return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
        return dataISO;
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

    async function handleAtualizar() {
        if (!nome || !cargoId) {
            Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
            return;
        }

        const cargoSelecionado = cargos.find((c) => c.id === cargoId);
        if (!cargoSelecionado) {
            Alert.alert("Erro", "Cargo inválido. Atualize e tente novamente.");
            return;
        }

        setSubmitting(true);
        try {
            // Converte a data de DD/MM/AAAA para AAAA-MM-DD
            const nascimentoISO = converterDataParaISO(nascimento);

            await api.put(`/colaboradores/${cpf}`, {
                nome,
                nascimento: nascimentoISO,
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

            Alert.alert("Sucesso", "Colaborador atualizado com sucesso!");
            router.back();
        } catch (error) {
            console.error("Erro ao atualizar colaborador:", error);
            Alert.alert("Erro", "Não foi possível atualizar o colaborador.");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text>Carregando dados...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Editar Colaborador</Text>

            <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} placeholderTextColor={"#999"} />
            <TextInput style={styles.input} placeholder="CPF" value={cpf as string} editable={false} placeholderTextColor={"#999"} />
            <TextInput
                style={styles.input}
                placeholder="Data de Nascimento (DD/MM/AAAA)"
                keyboardType="numeric"
                value={nascimento}
                onChangeText={(texto) => setNascimento(formatarData(texto))}
                placeholderTextColor={"#999"}
                maxLength={10}
            />
            <TextInput style={styles.input} placeholder="PIS/PASEP" keyboardType="numeric" value={pis} onChangeText={setPis} placeholderTextColor={"#999"} />
            <TextInput style={styles.input} placeholder="Telefone" keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} placeholderTextColor={"#999"} />
            <TextInput style={styles.input} placeholder="E-mail" keyboardType="email-address" value={email} onChangeText={setEmail} placeholderTextColor={"#999"} />
            <TextInput style={styles.input} placeholder="Bônus (R$)" keyboardType="numeric" value={bonus} onChangeText={setBonus} placeholderTextColor={"#999"} />
            <TextInput style={styles.input} placeholder="Auxílios (R$)" keyboardType="numeric" value={auxilios} onChangeText={setAuxilios} placeholderTextColor={"#999"} />

            <Text style={styles.label}>Selecione o Cargo:</Text>

            <TouchableOpacity
                style={styles.cargoSelector}
                onPress={() => setModalVisible(true)}
            >
                <Text style={cargoId ? styles.cargoSelectorText : styles.cargoSelectorPlaceholder}>
                    {cargoId
                        ? cargos.find(c => c.id === cargoId)?.nome || "Selecione um cargo"
                        : "Selecione um cargo"}
                </Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecione um Cargo</Text>

                        {loadingCargos ? (
                            <ActivityIndicator size="large" color="#2563eb" />
                        ) : (
                            <FlatList
                                data={cargos}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.cargoItem}
                                        onPress={() => {
                                            setCargoId(item.id);
                                            setModalVisible(false);
                                        }}
                                    >
                                        <Text style={styles.cargoNome}>{item.nome}</Text>
                                        <Text style={styles.cargoSalario}>
                                            R$ {Number(item.salario ?? 0).toFixed(2)}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={
                                    <Text style={styles.emptyText}>Nenhum cargo disponível</Text>
                                }
                            />
                        )}

                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalCloseText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity style={styles.fotoButton} onPress={escolherFoto}>
                <Text style={styles.buttonText}>Alterar Foto</Text>
            </TouchableOpacity>

            {foto && <Image source={{ uri: `data:image/jpeg;base64,${foto}` }} style={styles.preview} />}

            <TouchableOpacity style={[styles.button, submitting && { opacity: 0.7 }]} onPress={handleAtualizar} disabled={submitting}>
                <Text style={styles.buttonText}>{submitting ? "Atualizando..." : "Salvar Alterações"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.voltar}>Cancelar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#f8fafc" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 22, fontWeight: "bold", color: "#1d4ed8", marginBottom: 20, textAlign: "center" },
    input: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 8,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    label: { marginTop: 10, fontWeight: "bold", marginBottom: 5 },
    cargoSelector: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        marginVertical: 5,
    },
    cargoSelectorText: {
        fontSize: 16,
        color: "#333",
    },
    cargoSelectorPlaceholder: {
        fontSize: 16,
        color: "#999",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        width: "85%",
        maxHeight: "70%",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1d4ed8",
        marginBottom: 15,
        textAlign: "center",
    },
    cargoItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cargoNome: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
        flex: 1,
    },
    cargoSalario: {
        fontSize: 15,
        color: "#2563eb",
        fontWeight: "600",
    },
    emptyText: {
        textAlign: "center",
        color: "#999",
        marginTop: 20,
    },
    modalCloseButton: {
        backgroundColor: "#e5e7eb",
        padding: 12,
        borderRadius: 8,
        marginTop: 15,
    },
    modalCloseText: {
        color: "#333",
        textAlign: "center",
        fontWeight: "600",
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
    voltar: { color: "#2563eb", textAlign: "center", marginTop: 15, marginBottom: 20 },
});
