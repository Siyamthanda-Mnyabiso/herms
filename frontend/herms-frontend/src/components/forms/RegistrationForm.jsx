import AuthHeader from "../common/AuthHeader.jsx";
import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";
import Select from "../common/Select.jsx";
import SelectRole from "../common/SelectRole.jsx";
import Password from "../common/Password.jsx";
import {useState} from "react";
import AccountType from "./AccountType.jsx";

function Registration(){
    const [selectedRole, setSelectedRole] = useState("");
    return(
    <div className="registration-form">
        <AuthHeader /><br />
        <form className="flex flex-col gap-4">

            <Select
                name="role"
                label="Role"
                value={selectedRole}
                onChange={(ev) => setSelectedRole(ev.target.value)}
                options={[
                    {value:"--select role--", label:"-- Select Role --"},
                    {value:"organization", label:"Organization"},
                    {value:"teacher",label:"Teacher"},
                    {value:"doctor",label:"Doctor"},
                    {value:"nurse",label:"Nurse"},
                    {value:"pharmacist",label:"Pharmacist"},

                ]}
            />
            <div className="grid grid-cols-2  gap-4">
                <Input label="First Name" type="first-name" placeholder="Enter your first name" />
                <Input label="Last Name" type="last-name" placeholder="Enter your last name" />
            </div>
            <Input label="Email" type="email" placeholder="Enter your email" />

            <Input label="Phone number" type="phone-number" placeholder="Enter your phone number" />
            <Password />
             <Button variant="primary" size="md">Register</Button>


        </form>

        </div>
    );
}
export default Registration;