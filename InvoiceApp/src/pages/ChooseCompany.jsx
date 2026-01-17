import Company from "../components/Company"
import { useEffect, useState } from "react"

export default function ChooseCompany(props) {
    const [companyList, setCompanyList] = useState([])
    
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

    const pageContent = companyList.length !== 0 ? <div className="company-list">{companyList.map(x => (<Company 
            key={x.id}
            id={x.id}
            name={x.name} 
            email={x.email} 
            website={x.website} 
            phone={x.phone} 
            setChosenCompany={props.setChosenCompany}/>)
        )}</div>: <p>You have no company...</p>
    
    return pageContent
}