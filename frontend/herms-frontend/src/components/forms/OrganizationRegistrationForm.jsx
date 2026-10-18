import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";
import Select from "../common/Select.jsx";
import Password from "../common/Password.jsx";
import { useNotification } from "../../context/NotificationContext.jsx";
import { registerOrganization } from "../../services/authService.js";

const PROVINCES = [
    "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo",
    "Mpumalanga", "Northern Cape", "North West", "Western Cape",
];

const TYPE_LABELS = {
    hospital: "Hospital type (e.g. General, Specialist)",
    pharmacy: "Pharmacy type (e.g. Retail, Clinic)",
    school: "School type (e.g. Day school, Boarding)",
};

const EMPTY = {
    role: "", organizationName: "", email: "", phoneNumber: "", streetName: "", city: "",
    postalCode: "", province: "Gauteng", organizationType: "", sector: "Public", schoolLevel: "Primary",
};

function OrganizationRegistrationForm() {
    const [form, setForm] = useState(EMPTY);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { notify } = useNotification();

    const set = (field) => (ev) => setForm((f) => ({ ...f, [field]: ev.target.value }));

    async function handleSubmit(ev) {
        ev.preventDefault();
        if (!form.role) {
            notify("Please select an organization type.", "error");
            return;
        }
        if (password !== confirmPassword) {
            notify("Passwords do not match.", "error");
            return;
        }
        setSubmitting(true);
        try {
            await registerOrganization({ ...form, password });
            setSubmitted(true);
        } catch (err) {
            notify(err.response?.data ?? "Registration failed. Please try again.", "error");
        } finally {
            setSubmitting(false);
        }
    }

    if (submitted) {
        return (
            <div className="flex flex-col items-center gap-3 text-center">
                <p className="font-semibold text-green-950">Registration received</p>
                <p className="text-sm text-gray-600">
                    An admin will review your organization. You will be able to log in once it has been approved.
                </p>
                <Link to="/login" className="text-sm font-medium">Go to login</Link>
            </div>
        );
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Select
                label="Organization type"
                value={form.role}
                onChange={set("role")}
                options={[
                    { value: "", label: "-- Select Type --" },
                    { value: "hospital", label: "Hospital" },
                    { value: "pharmacy", label: "Pharmacy" },
                    { value: "school", label: "School" },
                ]}
            />
            <Input label="Organization name" value={form.organizationName} onChange={set("organizationName")} required />
            {form.role && (
                <Input label={TYPE_LABELS[form.role]} value={form.organizationType} onChange={set("organizationType")} required />
            )}
            {(form.role === "hospital" || form.role === "school") && (
                <Select
                    label="Sector"
                    value={form.sector}
                    onChange={set("sector")}
                    options={[{ value: "Public", label: "Public" }, { value: "Private", label: "Private" }]}
                />
            )}
            {form.role === "school" && (
                <Select
                    label="School level"
                    value={form.schoolLevel}
                    onChange={set("schoolLevel")}
                    options={[{ value: "Primary", label: "Primary" }, { value: "HighSchool", label: "High school" }]}
                />
            )}
            <Input label="Email" type="email" value={form.email} onChange={set("email")} required />
            <Input label="Phone number" value={form.phoneNumber} onChange={set("phoneNumber")} required />
            <Input label="Street address" value={form.streetName} onChange={set("streetName")} required />
            <div className="grid grid-cols-2 gap-4">
                <Input label="City" value={form.city} onChange={set("city")} required />
                <Input label="Postal code" value={form.postalCode} onChange={set("postalCode")} required />
            </div>
            <Select
                label="Province"
                value={form.province}
                onChange={set("province")}
                options={PROVINCES.map((p) => ({ value: p, label: p }))}
            />
            <Password value={password} onChange={setPassword} confirmValue={confirmPassword} onConfirmChange={setConfirmPassword} />
            <Button variant="primary" size="md" type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Register"}
            </Button>
        </form>
    );
}
export default OrganizationRegistrationForm;
