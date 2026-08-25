import AuthHeader from "../common/AuthHeader.jsx";
import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";
import Select from "../common/Select.jsx";
import SelectRole from "../common/SelectRole.jsx";
import Password from "../common/Password.jsx";

function Registration(){
    return(
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
        <AuthHeader /><br />
        <form className="flex flex-col gap-4">
            <div className="grid grid-cols-2  gap-4">
                <Input label="First Name" type="first-name" placeholder="Enter your first name" />
                <Input label="Last Name" type="last-name" placeholder="Enter your last name" />
            </div>
            <Input label="Email" type="email" placeholder="Enter your email" />
            <SelectRole />
            <Input label="Phone number" type="phone-number" placeholder="Entet your phone number" />
            <Password />
             <Button variant="primary" size="md">Register</Button>


        </form>

        </div>
    );
}
export default Registration;