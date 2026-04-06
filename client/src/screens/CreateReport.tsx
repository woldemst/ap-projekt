import React, { useCallback, useState } from "react";
import { View, Text, TextInput, Button, Pressable, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

import { fetchSuppliers, Supplier } from "../api/suppliers";
import { createReport } from "../api/reports";
import { Image } from "expo-image";

export function CreateReport() {
    const navigation = useNavigation<any>();
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<"OK" | "DEFECT">("OK");
    const [images, setImages] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function loadSuppliers() {
        try {
            setError(null);

            const data = await fetchSuppliers();
            setSuppliers(data);

            setSelectedSupplier((current) => {
                if (!current) {
                    return null;
                }

                const freshSelectedSupplier = data.find((supplier) => supplier._id === current._id);

                return freshSelectedSupplier?.isActive === true ? freshSelectedSupplier : null;
            });
        } catch (err: any) {
            setError(err.message ?? "Lieferanten konnten nicht geladen werden");
        }
    }

    async function pickFromLibrary() {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert("Berechtigung erforderlich", "Bitte den Zugriff auf die Galerie erlauben.");
            return;
        }

        if (images.length >= 5) {
            Alert.alert("Limit erreicht", "Maximal 5 Bilder pro Bericht");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            quality: 0.8,
            // allowsMultipleSelection: true,
        });

        if (!result.canceled && result.assets?.[0].uri) {
            setImages((current) => [...current, result.assets[0].uri]);
        }
    }

    function removeImage(uri: string) {
        setImages((current) => current.filter((imageUri) => imageUri != uri));
    }

    async function takePhoto() {
        const permission = await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
            Alert.alert("Berechtigung erforderlich", "Bitte den Zugriff auf die Kamera erlauben.");
            return;
        }

        if (images.length >= 5) {
            Alert.alert("Limit erreicht", "Maximal 5 Bilder pro Bericht");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets?.[0].uri) {
            setImages((current) => [...current, result.assets[0].uri]);
        }
    }

    function chooseMediaOption() {
        Alert.alert("Medien auswählen", "Ein neues Foto aufnehmen oder aus der Galerie wählen?", [
            {
                text: "Aufnehmen",
                onPress: () => takePhoto(),
            },
            { text: "Galerie", onPress: () => pickFromLibrary() },
        ]);
    }

    async function onCreate() {
        try {
            setError(null);

            if (!selectedSupplier) {
                setError("Bitte einen Lieferanten auswählen");
                return;
            }

            if (!title.trim()) {
                setError("Titel ist erforderlich");
                return;
            }

            setLoading(true);

            await createReport({
                title: title.trim(),
                description: description.trim(),
                supplierId: selectedSupplier._id,
                status,
                images,
            });

            setTitle("");
            setDescription("");
            setSelectedSupplier(null);
            setStatus("OK");
            setImages([]);

            if (Platform.OS === "web") navigation.navigate("ReportsScreen");

            Alert.alert("Erfolg", "Der Prüfbericht wurde erstellt.", [{ text: "OK", onPress: () => navigation.navigate("ReportsScreen") }]);
        } catch (err: any) {
            setError(err.message ?? "Bericht konnte nicht erstellt werden");
        } finally {
            setLoading(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadSuppliers();
        }, []),
    );

    return (
        <ScrollView>
            <View style={{ padding: 16, gap: 12 }}>
                {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

                <Text style={{ fontWeight: "600" }}>Titel</Text>
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="z. B. Lieferung vom 23.03"
                    style={{ borderWidth: 1, padding: 8 }}
                />

                <Text style={{ fontWeight: "600" }}>Beschreibung</Text>
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Optional"
                    style={{ borderWidth: 1, padding: 8, minHeight: 80 }}
                    multiline
                />

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <TouchableOpacity
                        style={[
                            styles.button,
                            { width: "48%" },
                            status === "OK" ? { backgroundColor: "grey" } : { backgroundColor: "#ccc" },
                        ]}
                        onPress={() => setStatus("OK")}
                    >
                        <Text style={styles.buttonText}>OK</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            { width: "48%" },
                            status === "DEFECT" ? { backgroundColor: "grey" } : { backgroundColor: "#ccc" },
                        ]}
                        onPress={() => setStatus("DEFECT")}
                    >
                        <Text style={styles.buttonText}>DEFECT</Text>
                    </TouchableOpacity>
                </View>

                {Platform.OS !== "web" && <Button title="Medien" onPress={chooseMediaOption} />}
                {Platform.OS === "web" && <Button title="Bild aus Galerie wählen" onPress={pickFromLibrary} />}

                {images.length > 0 ? (
                    <ScrollView horizontal contentContainerStyle={{ gap: 12 }}>
                        {images.map((item) => (
                            <View key={item} style={{ width: 120, gap: 8 }}>
                                <Image source={item} style={{ width: 120, height: 120, gap: 8 }} contentFit="cover" />
                                <Button title="Entfernen" onPress={() => removeImage(item)} />
                            </View>
                        ))}
                    </ScrollView>
                ) : (
                    <Text>Keine Bilder ausgewählt</Text>
                )}

                <Text style={{ fontWeight: "600" }}>Lieferanten auswählen</Text>
                <Button title="Lieferanten neu laden" onPress={loadSuppliers} />

                <View style={{ maxHeight: 220, borderWidth: 1 }}>
                    {suppliers.map((item) => {
                        const selected = selectedSupplier?._id === item._id;
                        const isSelectable = item.isActive === true;

                        return (
                            <Pressable
                                key={item._id}
                                onPress={() => {
                                    if (isSelectable) setSelectedSupplier(item);
                                }}
                                disabled={!isSelectable}
                                style={[
                                    {
                                        padding: 10,
                                        borderBottomWidth: 1,
                                        backgroundColor: selected ? "#eaeaea" : "transparent",
                                        opacity: isSelectable ? 1 : 0.5,
                                    },
                                    !isSelectable && { backgroundColor: "#f1f1f1" },
                                ]}
                            >
                                <Text>{item.title}</Text>
                            </Pressable>
                        );
                    })}
                </View>

                <Text>Lieferant: {selectedSupplier ? selectedSupplier.title : "Keiner ausgewählt"}</Text>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: "#1e90ff", marginBottom: 32 }]}
                    onPress={onCreate}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? "Speichern..." : "Bericht speichern"}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 2,
        fontSize: 14,
    },
    buttonText: {
        textAlign: "center",
        color: "#fff",
        fontSize: 16,
        fontWeight: 500,
    },
});
