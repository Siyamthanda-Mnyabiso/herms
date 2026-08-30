import AuthHeader from "../common/AuthHeader.jsx";
import Input from "../common/Input.jsx";
import Password from "../common/Password.jsx";
import Select from "../common/Select.jsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import Button from "../common/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useNotification } from "../../context/NotificationContext.jsx";
import { dashboardPathForRole } from "../../utils/constants.js";


function OrganizationRegistration(){
    const [role, setRole] = useState("");
    const [organizationName, setOrganizationName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const { registerOrganization } = useAuth();
    const { notify } = useNotification();
    const navigate = useNavigate();

    async function handleSubmit(ev) {
        ev.preventDefault();

        if (!role || role === "--select role--") {
            notify("Please select an organization type.", "error");
            return;
        }
        if (password !== confirmPassword) {
            notify("Passwords do not match.", "error");
            return;
        }

        setSubmitting(true);
        try {
            const data = await registerOrganization({ role, organizationName, email, password });
            navigate(dashboardPathForRole(data.role));
        } catch (err) {
            notify(err.response?.data ?? "Registration failed. Please try again.", "error");
        } finally {
            setSubmitting(false);
        }
    }

    return(
        <div className="organization-registration">
            <AuthHeader/>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <Select
                    name="role"
                    label="Role"
                    value={role}
                    onChange={(ev) => setRole(ev.target.value)}
                    options={[
                        {value:"--select role--", label:"-- Select Role --"},
                        {value:"hospital", label:"Hospital"},
                        {value:"pharmacy",label:"Pharmacy"},
                        {value:"school",label:"School"},

                    ]}
                />
                <Input label="Organization Name" placeholder="Enter the organization name" value={organizationName} onChange={(ev) => setOrganizationName(ev.target.value)} required />
                <Input label="Organization Email" type="email" placeholder="Enter organization email" value={email} onChange={(ev) => setEmail(ev.target.value)} required />
                <Password value={password} onChange={setPassword} confirmValue={confirmPassword} onConfirmChange={setConfirmPassword} />
                <Button variant="secondary" size="md" type="submit" disabled={submitting}>
                    {submitting ? "Creating account..." : "Register"}
                </Button>
            </form>
        </div>
    )
}
export default OrganizationRegistration;
