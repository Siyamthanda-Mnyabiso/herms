import LoginForm from "../../components/forms/LoginForm.jsx";
import Button from "../../components/common/Button.jsx";

function Login() {
    return (
        <div className= "flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
                <LoginForm/>
            </div>
        </div>
    );
}
export default Login;