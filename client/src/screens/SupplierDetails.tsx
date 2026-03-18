import { Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Supplier, fetchSupplierById } from "../api/suppliers";
import { useEffect, useState } from "react";

export function SupplierDetails({ route }: any) {
    const navigation = useNavigation();
    const [supplier, setSupplier] = useState<Supplier>();
    const { supplierId } = route.params;

    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    async function load() {
        try {
            setError(false);
            setLoading(false);
            setSupplier(await fetchSupplierById(supplierId));
        } catch (err: any) {
            setError(err.message);
            console.log(`Could not fetch supplier by id ${err.message}`);
        } finally {
            setError(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    if (loading) {
        return (
            <View>
                <Text>Nicht geladen</Text>
            </View>
        );
    }

    return (
        <>
            <View>
                {error ? <Text>{error}</Text> : null}
                <Text>{supplier?.title}</Text>
            </View>
        </>
    );
}

// const [error, setError] = useState(false);
// const [loading, setLoading] = useState(true);

// function load() {
//     try {
//         setError(false);
//         setLoading(false);
//     } catch (err: any) {
//         setError(err.message);
//         console.log(`Could not fetch supplier by id ${err.message}`);
//     } finally {
//         setError(false);
//     }
// }

// useEffect(() => {
//     load();
// }, []);

// if (loading) {
//     return (
//         <View>
//             <Text>Nicht geladen</Text>
//         </View>
//     );
// }

// return (
//     <>
//         <View>
//             {error ? <Text>{error}</Text> : null}
//             <Text>{}</Text>
//         </View>
//     </>
// );
