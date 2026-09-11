import Button from "./Button.jsx";
import {Link, useLocation} from "react-router-dom";

const ACTIVE_CLASSES = "w-full bg-primary-500 text-white font-semibold py-2";
const INACTIVE_CLASSES = "w-full bg-white text-gray-800 border border-gray-200 font-semibold py-2";

function AuthHeader() {
    const { pathname } = useLocation();
    const isLogin = pathname === "/login";

    return(
        <div className="grid grid-cols-2 w-full gap-3">
            <Link to="/login">
                <Button
                    className={`${isLogin ? ACTIVE_CLASSES : INACTIVE_CLASSES} rounded-l-lg`}
                    variant={isLogin ? "primary" : "secondary"}
                    size="md"
                >
                    Login
                </Button>
            </Link>
            <Link to="/account">
                <Button
                    className={`${!isLogin ? ACTIVE_CLASSES : INACTIVE_CLASSES} rounded-r-lg`}
                    variant={!isLogin ? "primary" : "secondary"}
                    size="md"
                >
                    Register
                </Button>
            </Link>

        </div>
    );
}
export default AuthHeader;