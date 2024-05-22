import { Outlet, useOutletContext } from "react-router-dom";
function OnboardingLayout() {
    const { setIsContentLoading, isContentLoading } = useOutletContext()
    return (
        <>
            <Outlet context={{ setIsContentLoading, isContentLoading }} />
        </>
    )
}

export default OnboardingLayout;