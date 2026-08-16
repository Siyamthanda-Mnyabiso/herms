import Button from "./Button.jsx";

function AuthHeader() {
    return(
        <div className="flex justify-center gep-4 mb-6">
            <Button variant="primary" size="md">Login</Button>
            <Button variant="secondary" size="md">Register</Button>
        </div>
    );
}
export default AuthHeader;