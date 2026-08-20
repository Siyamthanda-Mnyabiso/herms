import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";
import {Link} from "react-router-dom";

function ForgotPasswordForm(){
    return(
        <div className="forgot-password-form">
            <form className="flex flex-col gap-2">
                <h2 className="flex flex-col items-center justify-center text-2xl font-semibold text-green-900 mb-2">Forgot Password</h2>
                <label className="text-center text-gray-500 text-sm">
                    Remember your password ? <a href="/login" className="text-center size-sm text-primary-500">Login here</a>
                </label>
                <Input label="Email" type="email" placeholder="Enter your email address"/>
                <Link to="/reset-password">
                    <Button variant="primary" size="md" className="w-full">Submit</Button>
                </Link>


            </form>

        </div>
    )
}
export default ForgotPasswordForm;