import ForgotPasswordForm from "../../components/forms/ForgotPasswordForm.jsx";

function ForgotPassword(){
    return(
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
                <ForgotPasswordForm />
            </div>

        </div>
    )
}
export default ForgotPassword;