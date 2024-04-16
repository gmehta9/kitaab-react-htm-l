import { Outlet, useOutletContext } from "react-router-dom";
function OnboardingLayout() {
    const { setIsContentLoading } = useOutletContext()
    return (
        <>
            <Outlet context={{ setIsContentLoading }} />
        </>
    )
}

export default OnboardingLayout;