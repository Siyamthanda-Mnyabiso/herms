import Button from "../common/Button.jsx";
import {Link} from "react-router-dom";
import { FaUser, FaBuilding } from "react-icons/fa";

function AccountType(){
    return(
        <div className="account-type">
            <form className="flex flex-col gap-2 ">
                <label className=" flex items-center text-black text-md font-medium">
                    Choose Account Type
                </label>
                <label className="text-gray-500 text-sm italic ">
                   If you need more details, please check out  <a href="/help" className="text-green-950 text-sm italic hover:text-gray-700">Help center</a>
                </label>
                <Link to="/register">
                    <Button variant="secondary" className="flex items-center">
                        <FaUser className="text-gray-600" />
                        Freelancer Account
                    </Button>
                </Link>
                <Link to="/register">
                    <Button variant="secondary" className="flex items-center">
                        <FaBuilding className="text-gray-600" />
                        Organization Account
                    </Button>
                </Link>

                <label className="text-gray-500 text-sm italic hover:text-green-700">
                    Select your account type to customize fields
                </label>
            </form>

        </div>
    )
}
export default AccountType;
