import { useNavigate } from "react-router-dom"
import "../styles/Company.css"


export default function Company({id, name, email, website, phone, page, userToken, setCompanyList, setChosenCompany}) {
    const navigate = useNavigate()
    
    function openBranches() {
        setChosenCompany(id)
        if(page === "companies") {
            navigate(`/companies/${name}`)
        } else {
            navigate(`/chooseCompany/${name}/`)
        }
        
    }

    function removeCompany(event) {
        event.stopPropagation()
        let status = true
        fetch("https://localhost:7163/api/Branch", {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        }).then(response => response.json()).then(
            data => data.filter(item => item.companyId === id)
        ).then(data => data.map(item => fetch(`https://localhost:7163/api/Branch/${item.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${userToken}` 
            }
        }).then(response => {
            if(!response.ok) {
                status = false  
            }
        })
    ))
        if(status) {
             fetch(`https://localhost:7163/api/Company/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${userToken}`
            }
        }).then(response => {
            if(response.ok) {
                setCompanyList(prev => prev.filter(companies => companies.id !== id))
            } else {
                alert("Something went wrong...")
            }
        })
        } else {
            alert("Something went wrong, please try again.")
        }
    }
    
    return(
        <>  
            <div className="company-info" onClick={openBranches}>
                <p>{name}</p>
                <p>{email}</p>
                <p>{website}</p>
                <p>{phone}</p>
                <button onClick={removeCompany}>Remove Company</button>
            </div>
        </>
    )
}