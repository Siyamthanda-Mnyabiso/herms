import Select from "./Select.jsx";
import {useState} from "react";


function SelectRole(){
    const [selectedRole, setSelectedRole] = useState("");
    const[selectedOrganization, setSelectedOrganization] = useState("");

    const organizations = [
        {value: "hospital", label: "Hospital"},
        {value: "pharmacy", label: "Pharmacy"},
        {value: "school", label: "School"},
    ];
    return(
        <div className="flex flex-col gap-4">
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
            {selectedRole === "organization" && (
                <Select
                    name="organization"
                    label="-- Select Organization --"
                    value={selectedOrganization}
                    onChange={(ev) => setSelectedOrganization(ev.target.value)}
                    options={[
                        {value:"", label:"-- Select Organization --" },
                        ...organizations,

                    ]}
                />
            )}
        </div>
    );
}
export default SelectRole;