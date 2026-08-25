import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";
import AuthHeader from  "../common/AuthHeader.jsx"
import {Link} from "react-router-dom";
import Password from "../common/Password.jsx"

function LoginForm() {
    return (
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
            <AuthHeader />
            <form className="flex flex-col gap-4">
                <Input label="Email" type="email" placeholder="Enter your email" />
                <Password />
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
                <Button variant="primary" size="md">Login</Button>
            </form>
        </div>
    );
}
export  default LoginForm;