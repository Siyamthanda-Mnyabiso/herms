import Button from "../common/Button.jsx";
import {Link} from "react-router-dom";
import { FaUser, FaBuilding } from "react-icons/fa";

function AccountType(){
    return(
        <div className="account-type">
            <form className="flex flex-col gap-2">
                <label className=" flex flex-col items-center text-green-950 text-md font-bold">
                    Choose Account Type
                </label>
                <label className="text-gray-500 text-sm italic ">
                   If you need more details, please check out  <a href="/help" className="text-green-950 font-medium text-sm italic hover:text-green-700">Help center</a>
                </label>
                <div className="flex flex-col  gap-2">
                    <Link to="/register">
                        <Button variant="primary" className="flex items-center w-full">
                            <FaUser className="text-gray-600" />
                            Freelancer Account
                        </Button>
                    </Link>
                    <Link to="/organization-registration">
                        <Button variant="secondary" className="flex items-center w-full">
                            <FaBuilding className="text-gray-600" />
                            Organization Account
                        </Button>
                    </Link>
                </div>

                <label className=" text-sm  text-green-950 italic hover:text-gray-700">
                    Select your account type to customize fields
                </label>
            </form>

        </div>
    )
}
export default AccountType;
