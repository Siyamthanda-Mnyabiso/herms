import AuthHeader from "../common/AuthHeader.jsx";
import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";
import Select from "../common/Select.jsx";
import Password from "../common/Password.jsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useNotification } from "../../context/NotificationContext.jsx";
import { dashboardPathForRole } from "../../utils/constants.js";

const LICENSE_HINTS = {
    doctor: "Format: 2 letters followed by 7 digits, e.g. AB1234567",
    pharmacist: "Format: 2 letters followed by 7 digits, e.g. AB1234567",
    nurse: "Format: 8 digits, e.g. 12345678",
    teacher: "Format: 6 digits, e.g. 123456",
};

function Registration(){

    const [role, setRole] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [licenseNo, setLicenseNo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const { registerProfessional } = useAuth();
    const { notify } = useNotification();
    const navigate = useNavigate();

    async function handleSubmit(ev) {
        ev.preventDefault();

        if (!role || role === "--select role--") {
            notify("Please select a role.", "error");
            return;
        }
        if (password !== confirmPassword) {
            notify("Passwords do not match.", "error");
            return;
        }

        setSubmitting(true);
        try {
            const data = await registerProfessional({ role, firstName, lastName, email, phoneNumber, password, licenseNo });
            navigate(dashboardPathForRole(data.role));
        } catch (err) {
            notify(err.response?.data ?? "Registration failed. Please try again.", "error");
        } finally {
            setSubmitting(false);
        }
    }

    return(
    <div className="registration-form">
        <AuthHeader /><br />
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

            <Select
                name="role"
                label="Role"
                value={role}
                onChange={(ev) => setRole(ev.target.value)}
                options={[
                    {value:"--select role--", label:"-- Select Role --"},
                    {value:"teacher",label:"Teacher"},
                    {value:"doctor",label:"Doctor"},
                    {value:"nurse",label:"Nurse"},
                    {value:"pharmacist",label:"Pharmacist"},

                ]}
            />
            <div className="grid grid-cols-2  gap-4">
                <Input label="First Name" placeholder="Enter your first name" value={firstName} onChange={(ev) => setFirstName(ev.target.value)} required />
                <Input label="Last Name" placeholder="Enter your last name" value={lastName} onChange={(ev) => setLastName(ev.target.value)} required />
            </div>
            <Input label="Email" type="email" placeholder="Enter your email" value={email} onChange={(ev) => setEmail(ev.target.value)} required />

            <Input label="Phone number" placeholder="Enter your phone number" value={phoneNumber} onChange={(ev) => setPhoneNumber(ev.target.value)} required />

            <div>
                <Input
                    label="License number"
                    placeholder="Enter your professional license number"
                    value={licenseNo}
                    onChange={(ev) => setLicenseNo(ev.target.value)}
                    required
                />
                {role && LICENSE_HINTS[role] && (
                    <p className="mt-1 text-xs text-gray-500">{LICENSE_HINTS[role]}</p>
                )}
            </div>
            <Password value={password} onChange={setPassword} confirmValue={confirmPassword} onConfirmChange={setConfirmPassword} />
             <Button variant="primary" size="md" type="submit" disabled={submitting}>
                 {submitting ? "Creating account..." : "Register"}
             </Button>


        </form>

        </div>
    );
}
export default Registration;
