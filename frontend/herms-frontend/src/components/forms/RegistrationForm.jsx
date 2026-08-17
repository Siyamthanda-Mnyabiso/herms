import AuthHeader from "../common/AuthHeader.jsx";
import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";
import Select from "../common/Select.jsx";
import SelectRole from "../common/SelectRole.jsx";

function Registration(){
    return(
    <div className="registration-form">
            <AuthHeader />
        <form className="flex flex-col gap-4">
            <Input label="First Name" type="first-name" placeholder="Enter your first name" />
            <Input label="Last Name" type="last-name" placeholder="Enter your last name" />
            <Input label="Email" type="email" placeholder="Enter your email" />
            <SelectRole />
            <Input label="Phone number" type="phone-number" placeholder="Entet your phone number" />
            <Input label="Password" type="password" placeholder="Enter your password" />
            <Input label="Confirm password" type="password" placeholder="Confirm password" />
            <Button variant="primary" size="md">Register</Button>


        </form>

        </div>
    );
}
export default Registration;