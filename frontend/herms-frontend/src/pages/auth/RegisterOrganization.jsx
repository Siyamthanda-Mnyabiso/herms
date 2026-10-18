import RegistrationOrganizationForm from "../../components/forms/OrganizationRegistrationForm.jsx";
import hermsLogo from "../../assets/images/herms-logo.png";

function RegisterOrganization() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 pt-24 pb-8 gap-4">
            <a href="/" className="flex items-center">
                <img src={hermsLogo} alt="HERMS" className="w-50" />
            </a>
            <label className="flex flex-col items-center text-green-950 text-xl font-bold">
                Register your organization
            </label>
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
                <RegistrationOrganizationForm />
                <div className="text-center mt-4 text-sm text-gray-600">
                    Already have an account? <a href="/login" className="font-medium"> Click here to Login</a>
                </div>
            </div>
            <label className="text-center text-gray-500 text-sm">
                <a href="/" className="italic hover:text-green-700"> ← Back to home</a>
            </label>
        </div>
    );
}
export default RegisterOrganization;
