import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import '../styles/Header.css'

export default function Header(props) {
	const navigate = useNavigate()

	function toLoginPage() {
		navigate("/login")
	}

	function logOut() {
		props.setUserInfo(null)
		props.setUserToken(null)
		navigate("/")
	}

	function layout() {
		return (!props.useIsMobile() ? 
			<header className="nav-header">
				<nav>
					<Link to={"/"} className="link app-name">FinanceApp</Link>
					{props.userInfo ? <Link to={"/profile"} className="link">{props.userInfo.name}</Link>: <Link to={"/login"} className="link">Login</Link>}
					{props.userInfo && <><Link to={"/companies"} className="link">My Companies</Link>
					<Link to={"/chooseCompany"} className="link">Create Invoice</Link>
					<Link to={"/createdInvoices"} className="link">Created Invoices</Link></>}
				</nav>
				<button onClick={props.userInfo ? logOut: toLoginPage} className="nav-button">{props.userInfo ? "Log out" : "Log in"}</button>
			</header>: 
			<header className="nav-header"></header>)
}

	return layout()
}