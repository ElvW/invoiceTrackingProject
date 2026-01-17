import "../styles/Home.css"
import { useNavigate } from "react-router-dom"

export default function Home(props) {
    const navigate = useNavigate()

    function goToLogin() {
        navigate('/Login')
    }

    function goToCreateInvoice() {
        navigate("/chooseCompany")
    }

    return(
        <>
            {!props.userInfo ?
            <main className="home-page">
                <p className="welcome-text">Welcome to the InvoiceApp!</p>
                <p>Keep record for all of your Invoices for all your companies</p>
                <button onClick={goToLogin}>SIGN IN</button>
            </main>: 
            <main className="home-page">
                <p className="welcome-text">Welcome back {props.userInfo.name}!</p>
                <button onClick={goToCreateInvoice}>Create an Invoice</button>
            </main>
            }
        </>
    )
}