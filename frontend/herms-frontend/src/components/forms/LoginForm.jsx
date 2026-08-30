import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";
import AuthHeader from  "../common/AuthHeader.jsx"
import Password from "../common/Password.jsx"
import { useAuth } from "../../hooks/useAuth.js";
import { useNotification } from "../../context/NotificationContext.jsx";
import { dashboardPathForRole } from "../../utils/constants.js";

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const { login } = useAuth();
    const { notify } = useNotification();
    const navigate = useNavigate();

    async function handleSubmit(ev) {
        ev.preventDefault();
        setSubmitting(true);
        try {
            const data = await login(email, password);
            navigate(dashboardPathForRole(data.role));
        } catch (err) {
            notify(err.response?.data ?? "Login failed. Check your email and password.", "error");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="login-form">
            <AuthHeader />
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <Input
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    required
                />
                <Password showConfirm={false} value={password} onChange={setPassword} />
                <div className="flex items-center justify-between text-sm gap-2" >
                    <label className="flex items-center gap-2">
                           <input type="checkbox" />
                        Remember me
                    </label>
                    <Link to="/forgot-password">
                        <label className="text-center  text-sm text-gray-500">
                            Forgot password ?
                        </label>
                    </Link>
                </div>
                <Button variant="primary" size="md" type="submit" disabled={submitting}>
                    {submitting ? "Logging in..." : "Login"}
                </Button>
            </form>
        </div>
    );
}
export  default LoginForm;
