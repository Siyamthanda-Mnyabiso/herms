import Password from "../common/Password.jsx";
import Button from "../common/Button.jsx";

function ResetPassword(){
    return(
        <div className="reset-password ">
            <form className="flex flex-col gap-3">
                <Password />
                <Button variant="primary" size="md">Submit</Button>
            </form>
        </div>
    )
}
export default ResetPassword;