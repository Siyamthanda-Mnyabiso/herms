import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Password from "../common/Password.jsx";
import Button from "../common/Button.jsx";
import { useNotification } from "../../hooks/useNotification.js";
import { resetPassword } from "../../services/authService.js";

function ResetPassword(){
    const [params] = useSearchParams();
    const token = params.get("token");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { notify } = useNotification();
    const navigate = useNavigate();

    if (!token) {
        return (
            <p className="text-sm text-gray-600">
                This page needs the link from your reset email.{" "}
                <Link to="/forgot-password" className="text-primary-500">Request a new link</Link>
            </p>
        );
    }

    async function handleSubmit(ev) {
        ev.preventDefault();
        if (password !== confirmPassword) {
            notify("Passwords do not match.", "error");
            return;
        }
        setSubmitting(true);
        try {
            await resetPassword(token, password);
            notify("Password updated. You can now log in.", "success");
            navigate("/login");
        } catch (err) {
            notify(err.response?.data ?? "Could not reset your password. Please try again.", "error");
        } finally {
            setSubmitting(false);
        }
    }

    return(
        <div className="reset-password ">
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
                <Password
                    value={password}
                    onChange={setPassword}
                    confirmValue={confirmPassword}
                    onConfirmChange={setConfirmPassword}
                />
                <Button variant="primary" size="md" type="submit" disabled={submitting}>
                    {submitting ? "Saving..." : "Set new password"}
                </Button>
            </form>
        </div>
    )
}
export default ResetPassword;
