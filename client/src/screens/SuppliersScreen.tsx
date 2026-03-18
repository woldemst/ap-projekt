import { useEffect, useState } from "react";
import { fetchSuppliers, Supplier, createSupplier } from "../api/suppliers";
import { View, Text, FlatList, Pressable, TextInput, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

export function SuppliersScreen() {
    const navigation = useNavigation();

    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    const [title, setTitle] = useState("");
    const [contactMail, setContactMail] = useState("");
    const [phone, setPhone] = useState("");
    const [notes, setNotes] = useState("");

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    async function load() {
        try {
            setError(false);
            setLoading(true);

            setSuppliers(await fetchSuppliers());
            setLoading(false);
        } catch (err: any) {
            console.log(`Could not fetch suppliers ${err.message}`);
        } finally {
            setError(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function onCreate() {
        try {
            await createSupplier({ title, contactMail, phone, notes });
            setTitle("");
            setContactMail("");
            setPhone("");
            setNotes("");
            load();
        } catch (err: any) {
            setError(err.message);
            console.error(`Could not create supplier ${err.message}`);
        }
    }

    if (loading) {
        return (
            <View>
                <Text>Nicht geladen</Text>
            </View>
        );
    }

    return (
        <>
            <View style={{ padding: 16, gap: 12 }}>
                <View style={{ padding: 8, gap: 8 }}>
                    <TextInput
                        style={{ borderWidth: 1, padding: 8, borderRadius: 4 }}
                        onChangeText={setTitle}
                        value={title}
                        placeholder="Titel"
                    />
                    <TextInput
                        style={{ borderWidth: 1, padding: 8, borderRadius: 4 }}
                        onChangeText={setContactMail}
                        value={contactMail}
                        placeholder="example@mail.com"
                    />
                    <TextInput
                        style={{ borderWidth: 1, padding: 8, borderRadius: 4 }}
                        onChangeText={setPhone}
                        value={phone}
                        placeholder="Telefonnummer"
                    />
                    <TextInput
                        style={{ borderWidth: 1, padding: 8, borderRadius: 4 }}
                        onChangeText={setNotes}
                        value={notes}
                        placeholder="Notiz"
                        multiline
                        numberOfLines={3}
                    />

                    <Button title="Anlegen" onPress={onCreate} />
                </View>
                {error ? <Text>{error}</Text> : null}
                <FlatList
                    data={suppliers}
                    keyExtractor={(s) => s._id}
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={() => navigation.navigate("SupplierDetails", { supplierId: item._id })}
                            style={{ paddingVertical: 8, borderBottomWidth: 1 }}
                        >
                            <Text style={{ fontWeight: "600" }}>{item.title}</Text>
                            {item.contactMail ? <Text>{item.contactMail}</Text> : null}
                            {item.notes ? <Text>{item.notes}</Text> : null}
                        </Pressable>
                    )}
                />
            </View>
        </>
    );
}
