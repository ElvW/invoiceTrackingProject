 import { useEffect, useState } from "react"
 import { useNavigate } from "react-router-dom"
 import Company from "../components/Company"
 
 export default function Companies(props) {
    const navigate = useNavigate()
    const [companyList, setCompanyList] = useState([])

    function addCompany() {
        navigate('/addCompany')
    }
    
    useEffect(() => {
        fetch("https://localhost:7163/api/Company", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${props.userToken}` 
            }
        }).then(response => response.json()).then(
            data => data.filter(item => item.userId === props.userInfo.userId)
        ).then(
            data => setCompanyList(data)
        )
    }, [])
    
    const pageContent = companyList.map(x => (<Company 
        key={x.id}
        id={x.id}
        name={x.name} 
        email={x.email} 
        website={x.website} 
        phone={x.phone} 
        page={"companies"}
        userToken = {props.userToken}
        setCompanyList={setCompanyList}
        setChosenCompany={props.setChosenCompany}/>)
    )

    return (
        <>
            <div className="company-list">
                {pageContent}
                <button onClick={addCompany}>+</button>
            </div>
            
        </>
    )
 }