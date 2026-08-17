
import RegistrationForm from "../../components/forms/RegistrationForm.jsx";

function Register(){
    return(
        <div className="flex item-start justify-center min-h-screen bg-gray-50 pt-24">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
                <RegistrationForm />
            </div>
        </div>
    )
}
export default Register;