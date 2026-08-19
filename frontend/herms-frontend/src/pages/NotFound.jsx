import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/common/ErrorMessage";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-white p-6">
            <ErrorMessage
                title="Page not found"
                message="This page doesn't exist yet or the link is broken."
                onRetry={() => navigate("/")}
            />
        </div>
    );
}