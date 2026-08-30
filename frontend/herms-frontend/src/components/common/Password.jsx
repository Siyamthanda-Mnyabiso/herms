import Input from "./Input.jsx";
import {useState} from "react";

function Password({ value, onChange, confirmValue, onConfirmChange, showConfirm = true }){
    const [password, setPassword] = useState(value ?? "");
    const [confirmPassword, setConfirmPassword] = useState(confirmValue ?? "");

    const isControlled = value !== undefined;
    const currentPassword = isControlled ? value : password;

    const isConfirmControlled = confirmValue !== undefined;
    const currentConfirm = isConfirmControlled ? confirmValue : confirmPassword;

    const handlePasswordChange = (ev) => {
        const next = ev.target.value;
        if (!isControlled) setPassword(next);
        onChange?.(next);
    };

    const handleConfirmChange = (ev) => {
        const next = ev.target.value;
        if (!isConfirmControlled) setConfirmPassword(next);
        onConfirmChange?.(next);
    };

    return(
        <div className="flex flex-col gap-4">
            <Input name="password"
                   label="Password"
                   type="password"
                   placeholder="Enter your password"
                   value={currentPassword}
                   onChange={handlePasswordChange}
            />

            { showConfirm && currentPassword && (
            <Input
                name="confirm-password"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                value={currentConfirm}
                onChange={handleConfirmChange}
                />
            )}
        </div>


    );
}
export default Password;
