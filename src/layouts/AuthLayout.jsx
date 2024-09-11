import { NavLink, Outlet, useNavigation } from "react-router-dom";

// delete this, add layout for each usertype and define navigations there (no page loading)
export const AuthLayout = () => {
    const navigation = useNavigation();
    return (
        <div className="main-layout">
            <header>
                <nav>
                    <NavLink to="/">Login</NavLink>
                </nav>
            </header>
            <main>
                { navigation.state === "loading" &&  <Loading /> }           
                <Outlet/>
            </main>
        </div>
    );
}