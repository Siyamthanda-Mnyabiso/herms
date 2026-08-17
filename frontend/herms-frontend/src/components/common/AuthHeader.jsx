import Button from "./Button.jsx";
import {Link} from "react-router-dom";

function AuthHeader() {
    return(
        <div className="grid grid-cols-2 w-full">
            <Link to="/login">
                <Button className="w-full bg-primary-500 text-white font-semibold py-2 rounded-l-lg" variant="primary" size="md">Login</Button>
            </Link>
            <Link to="/register">
                <Button className="w-full bg-white text-gray-800 border border-gray-200 font-semibold py-2 rounded-r-lg" variant="secondary" size="md">Register</Button>
            </Link>

        </div>
    );
}
export default AuthHeader;