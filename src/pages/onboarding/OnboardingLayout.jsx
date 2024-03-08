import { Outlet } from "react-router-dom";
import Loader from "../../components/Loader";

function OnboardingLayout() {

    return (
        <>
            <Loader />
            <Outlet />
        </>
    )
}

export default OnboardingLayout;