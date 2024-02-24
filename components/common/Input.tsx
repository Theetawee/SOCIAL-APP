import { TextInput } from "react-native"

const Input = ({
    value,
    onchange,
    label,
    type = "default",
    secure=false,
}: {
    value: string;
    onchange: (text: string) => void;
    label: string;
    type?:
        | "email-address"
        | "number-pad"
        | "decimal-pad"
        | "numeric"
        | "phone-pad"
        | "url"
        | "default";
    secure?:boolean
}) => {
    return (
        <TextInput
            value={value}
            keyboardType={type}
            secureTextEntry={secure}
            autoCapitalize="none"
            placeholder={label}
            cursorColor={"black"}
            onChangeText={onchange}
            className="bg-white border border-gray-300 text-gray-900  rounded focus:ring-blue-500 focus:border-2 focus:border-blue-500 block w-full p-2.5 "
        />
    );
};

export default Input
