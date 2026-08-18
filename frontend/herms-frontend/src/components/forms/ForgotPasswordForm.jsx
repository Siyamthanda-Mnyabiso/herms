import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";

function ForgotPasswordForm(){
    return(
        <div className="forgot-password-form">
            <form className="flex flex-col gap-2">
                <label className="text-center text-black-600  font-bold text-xl" >
                    Forgot Password ?
                </label>
                <label className="text-center text-gray-500 text-sm">
                    Remember your password ? <a href="/login" className="text-center size-sm text-primary-500">Login here</a>
                </label>
                <Input label="Email" type="email" placeholder="Enter your email address"/>
                <Button variant="primary" size="md">Submit</Button>

            </form>

        </div>
    )
}
export default ForgotPasswordForm;