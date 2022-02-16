import Navigation from "@components/Navigation";
import Meta from "@components/Meta";

const Layout = ({ children }) => {
    return <div>
        <Meta />
        <Navigation />
        <div style={{ height: '67px' }} />
        {children}
    </div>
}

export default Layout;