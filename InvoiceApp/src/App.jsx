import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import './styles/App.css'
import './styles/Index.css'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Companies from "./pages/Companies"
import Branches from "./pages/Branches"
import ChooseCompany from "./pages/ChooseCompany"
import CreatedInvoices from "./pages/CreatedInvoices"
import AddCompany from "./pages/AddCompany"
import Profile from "./pages/Profile"
import AddBranch from "./pages/AddBranch"
import CreateInvoice from "./pages/CreateInvoice"

export default function App() {
	const [userToken, setUserToken] = useState(null)
	const [userInfo, setUserInfo] = useState(null)
	const [chosenCompany, setChosenCompany] = useState(null)
	const navigate = useNavigate()

	useEffect(() => {
		if(userToken) {
			fetch("https://localhost:7163/api/Auth/get-user-summary", {
				method: "POST",
				body: JSON.stringify({"jwtToken": userToken}),
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${userToken}`
				}
			}).then(response => response.json()).then(
				json => setUserInfo(json)
			)
		} else {
			navigate("/")
		}
	}, [userToken])

	const companies = [
		{id: 1, companyName: "BlaBla", email: "blabla@bla.com", website: "blablabla.com", phone: "+123456789"},
		{id: 2, companyName: "BlaBla", email: "blabla@bla.com", website: "blablabla.com", phone: "+123456789"},
		{id: 3, companyName: "BlaBla", email: "blabla@bla.com", website: "blablabla.com", phone: "+123456789"},
		{id: 4, companyName: "BlaBla", email: "blabla@bla.com", website: "blablabla.com", phone: "+123456789"},
		{id: 5, companyName: "BlaBla", email: "blabla@bla.com", website: "blablabla.com", phone: "+123456789"},
		{id: 6, companyName: "BlaBla", email: "blabla@bla.com", website: "blablabla.com", phone: "+123456789"},
	]

  function useIsMobile() {
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

	useEffect(() => {
	  const handleResize = () => setIsMobile(window.innerWidth <= 768);
	  window.addEventListener("resize", handleResize);
	  return () => window.removeEventListener("resize", handleResize);
	}, []);

	return isMobile;
  }

  return (
	<>
		<Header userInfo={userInfo} setUserInfo={setUserInfo} setUserToken={setUserToken} useIsMobile={useIsMobile} />
		<Routes>
		  <Route path="/" element={<Home userInfo={userInfo} />} />
		  <Route path="/login" element={<Login setUserToken={setUserToken}/>} />
		  <Route path="/companies" element={<Companies userInfo={userInfo} userToken={userToken} setChosenCompany={setChosenCompany}/>} />
		  <Route path="/companies/:name" element={<Branches chosenCompany={chosenCompany} userToken={userToken}/>} />
		  <Route path="/chooseCompany" element={<ChooseCompany userToken={userToken} userInfo={userInfo} setChosenCompany={setChosenCompany} />} />
		  <Route path="/createdInvoices" element={<CreatedInvoices userToken={userToken} userInfo={userInfo}/>} />
		  <Route path="/addCompany" element={<AddCompany userToken={userToken}/>} />
		  <Route path="/companies/:name/addBranch" element={<AddBranch chosenCompany={chosenCompany} userToken={userToken}/>} />
		  <Route path="/profile" element={<Profile />} />
		  <Route path="/chooseCompany/:name" element={<CreateInvoice userToken={userToken} userInfo={userInfo} chosenCompany={chosenCompany}/>} />
		</Routes>
	</>
  )
}
