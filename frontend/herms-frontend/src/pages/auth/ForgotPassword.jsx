import ForgotPasswordForm from "../../components/forms/ForgotPasswordForm.jsx";
import hermsLogo from "../../assets/images/herms-logo.png";

function ForgotPassword(){
    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 pt-24 gap-3">
            <a href="/" className="flex items-center">
                <img src={hermsLogo} alt="HERMS" className="w-50" />
            </a>
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
                <ForgotPasswordForm />
            </div>
            <label className="text-center text-gray-500 text-sm">
                <a href="/login" className="text-center size-sm text-gray-500 italic hover:text-green-700"> ← Back </a>
            </label>
        </div>

    )
}
export default ForgotPassword;