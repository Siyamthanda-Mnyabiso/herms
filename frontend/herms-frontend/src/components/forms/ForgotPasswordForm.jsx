import { useState } from "react";
import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";
import { useNotification } from "../../context/NotificationContext.jsx";
import { forgotPassword } from "../../services/authService.js";

function ForgotPasswordForm(){
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);
    const { notify } = useNotification();

    async function handleSubmit(ev) {
        ev.preventDefault();
        setSubmitting(true);
        try {
            await forgotPassword(email);
            setSent(true);
        } catch (err) {
            notify(err.response?.data ?? "Could not send the reset link. Please try again.", "error");
        } finally {
            setSubmitting(false);
        }
    }

    if (sent) {
        return (
            <div className="forgot-password-form flex flex-col gap-3">
                <h2 className="text-2xl font-semibold text-green-900">Check your email</h2>
                <p className="text-sm text-gray-600">
                    If <span className="font-medium">{email}</span> has an account, we've sent a link to choose a new
                    password. It is valid for 1 hour.
                </p>
                <a href="/login" className="text-sm text-primary-500">Back to login</a>
            </div>
        );
    }

    return(
        <div className="forgot-password-form">
            <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                <h2 className="flex flex-col items-center justify-center text-2xl font-semibold text-green-900 mb-2">Forgot Password</h2>
                <label className="text-center text-gray-500 text-sm">
                    Remember your password ? <a href="/login" className="text-center size-sm text-primary-500">Login here</a>
                </label>
                <Input
                    label="Email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    required
                />
                <Button variant="primary" size="md" type="submit" className="w-full" disabled={submitting}>
                    {submitting ? "Sending..." : "Send reset link"}
                </Button>
            </form>
        </div>
    )
}
export default ForgotPasswordForm;
