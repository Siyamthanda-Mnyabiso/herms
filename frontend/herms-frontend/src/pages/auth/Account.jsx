import hermsLogo from "../../assets/images/herms-logo.png";
;
import AccountType from "../../components/forms/AccountType.jsx";

function Account() {
    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 pt-24 gap-3">
            <a href="/" className="flex items-center">
                <img src={hermsLogo} alt="HERMS" className="w-50" />
            </a>
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
                <AccountType />
            </div>
            <label className="text-center text-gray-500 text-sm">
                <a href="/" className="text-center size-sm text-gray-500 italic hover:text-green-700"> ← Back to home</a>
            </label>
        </div>
    )

}
export default Account;