import AuthHeader from "../common/AuthHeader.jsx";
import Input from "../common/Input.jsx";
import Password from "../common/Password.jsx";
import Select from "../common/Select.jsx";
import {useState} from "react";
import Button from "../common/Button.jsx";


function OrganizationRegistration(){
const [selectedRole, setSelectedRole] = useState("");
    return(
        <div className="organization-registration">
            <AuthHeader/>
            <form className="flex flex-col gap-3">
                <Select
                    name="role"
                    label="Role"
                    value={selectedRole}
                    onChange={(ev) => setSelectedRole(ev.target.value)}
                    options={[
                        {value:"--select role--", label:"-- Select Role --"},
                        {value:"hospital", label:"Hospital"},
                        {value:"pharmacy",label:"Pharmacy"},
                        {value:"school",label:"School"},

                    ]}
                />
                <Input label="Organization Name" type="name" placeholder="Enter the organization name"/>
                <Input label="Organization Email" type="email" placeholder="Enter organization email" />
                <Password/>
                <Button variant="secondary" size="md">Register</Button>
            </form>
        </div>
    )
}
export default OrganizationRegistration;