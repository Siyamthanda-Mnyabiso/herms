import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";
import AuthHeader from  "../common/AuthHeader.jsx"

function LoginForm() {
    return (
        <div className="login-form">
            <AuthHeader />
            <form className="flex flex-col gap-4">
                <Input label="Email" type="email" placeholder="Enter your email" />
                <Input label="Password" type="password" placeholder="Enter your password" />
                <Button variant="primary" size="md">Login</Button>
            </form>
        </div>
    );
}
export  default LoginForm;