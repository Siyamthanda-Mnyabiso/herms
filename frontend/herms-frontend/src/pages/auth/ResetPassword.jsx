import Password from "../../components/common/Password.jsx";
import Button from "../../components/common/Button.jsx";
import hermsLogo from "../../assets/images/herms-logo.png";
import ResetPasswordForm from "../../components/forms/ResetPasswordForm.jsx";
import ForgotPasswordForm from "../../components/forms/ForgotPasswordForm.jsx";


function ResetPassword() {
    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <a href="/" className="mb-6">
                <img src={hermsLogo} alt="HERMS" className="w-32" />
            </a>
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
                <h2 className="text-2xl font-semibold text-green-900 mb-2">New Password</h2>
                <p className="text-gray-600 text-sm mb-6">
                    Changing your password will also update it on your HERMS app profile.
                </p>

                <ResetPasswordForm />
            </div>
            <label className="text-center text-gray-500 text-sm">
                <a href="/forgot-password" className="text-center size-sm text-gray-500 italic hover:text-green-700"> ← Back </a>
            </label>
        </div>
    )



}
export default ResetPassword;