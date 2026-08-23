import Input from "./Input.jsx";
import {useState} from "react";

function Password(){
    const [password, setPassword] = useState("");
    return(
        <div className="flex flex-col gap-4">
            <Input name="password"
                   label="Password"
                   type="password"
                   placeholder="Enter your password"
                   value={password}
                   onChange={(ev) => setPassword(ev.target.value)}
            />

            { password && (
            <Input
                name="confirm-password"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                />
            )}
        </div>


    );
}
export default Password;