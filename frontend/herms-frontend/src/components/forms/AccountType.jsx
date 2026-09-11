import Button from "../common/Button.jsx";
import {Link} from "react-router-dom";
import { FaUser } from "react-icons/fa";

function AccountType(){
    return(
        <div className="account-type">
            <form className="flex flex-col gap-2">
                <label className=" flex flex-col items-center text-green-950 text-md font-bold">
                    Choose Account Type
                </label>
                <label className="text-gray-500 text-sm italic ">
                   Organizations are onboarded directly by our team — please email or call us to set up an account. If you need more details, please check out  <a href="/help" className="text-green-950 font-medium text-sm italic hover:text-green-700">Help center</a>
                </label>
                <div className="flex flex-col  gap-2">
                    <Link to="/register">
                        <Button variant="primary" className="flex items-center w-full">
                            <FaUser className="text-gray-600" />
                            Freelancer Account
                        </Button>
                    </Link>
                </div>
            </form>

        </div>
    )
}
export default AccountType;
