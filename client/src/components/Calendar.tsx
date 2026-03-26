import React, { useState } from "react";
import { Platform, Text, StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
import { Overlay } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";

export function CustomDatePicker({ props }: any) {
    const [state, setState] = useState({
        dateString: moment(new Date()).format("YYYY-MM-DD"),
        date: props.date || new Date(),
        show: false,
    });
    function onChange(event: any, selectedDate: any) {
        console.log(selectedDate);
        setState({ ...state, dateString: moment(selectedDate).format("YYYY-MM-DD"), date: selectedDate });
    }
    const showOverlay = () => {
        setState({ ...state, show: true });
    };
    const hideOverlay = () => {
        setState({ ...state, show: false });
    };
    return (
        <View style={{ flex: 1, borderRadius: 100 }}>
            <TouchableOpacity onPress={showOverlay} style={styles.inputContainerStyle}>
                {state.dateString ? (
                    <Text style={styles.textStyle}>{state.dateString}</Text>
                ) : (
                    <Text style={styles.placeholderStyle}>{props.placeholder}</Text>
                )}
            </TouchableOpacity>
            {Platform.OS === "ios" ? (
                <Overlay isVisible={state.show} onBackdropPress={hideOverlay} overlayStyle={styles.overlayStyle}>
                    <View style={styles.headerStyle}>
                        <TouchableOpacity onPress={hideOverlay}>
                            <Text style={{ paddingHorizontal: 15 }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={hideOverlay}>
                            <Text style={{ paddingHorizontal: 15, color: "green" }}>Done</Text>
                        </TouchableOpacity>
                    </View>
                    <DateTimePicker
                        value={state.date}
                        mode={"date"}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                        style={{ backgroundColor: "white" }}
                    />
                </Overlay>
            ) : (
                <>
                    {state.show && (
                        <DateTimePicker
                            value={state.date}
                            mode={"date"}
                            is24Hour={true}
                            display="default"
                            onChange={onChange}
                            style={{ backgroundColor: "white" }}
                        />
                    )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    overlayStyle: {
        flex: 1,
        width: "100%",
        justifyContent: "flex-end",
        backgroundColor: "#00000066",
    },
    headerStyle: {
        backgroundColor: "white",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderColor: "#CDCDCD",
        borderBottomWidth: 1,
        height: 50,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    inputContainerStyle: {
        alignItems: "flex-start",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#CAD3DF",
        borderRadius: 5,
        marginVertical: 10,
        marginHorizontal: 10,
        paddingRight: 10,
        height: 50,
    },
    placeholderStyle: {
        fontFamily: "Gill Sans",
        fontSize: 16,
        color: "#CDCDCD",
        marginHorizontal: 10,
    },
    textStyle: {
        fontFamily: "Gill Sans",
        fontSize: 16,
        marginHorizontal: 10,
    },
});
