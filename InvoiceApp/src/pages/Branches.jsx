import { use, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import Branch from "../components/Branch"
import "../styles/Branches.css"

export default function Branches(props) {
    const { name } = useParams()
    const navigate = useNavigate()
    const [branchList, setBranchList] = useState([])

    useEffect(() => {
        fetch("https://localhost:7163/api/Branch", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${props.userToken}`
            }
        }).then(response => response.json()).then(
            data => data.filter(branch => branch.companyId === props.chosenCompany)
        ).then(
            data => setBranchList(data)
        )
    },[])

    function addBranch() {
        navigate(`/companies/${name}/addBranch`)
    }

    const pageContent = branchList.map(branch => <Branch key={branch.id} name={branch.name} id={branch.id} setBranchList={setBranchList} userToken={props.userToken}/>)

    return (
        <>
            <div className="branch-container">
                {pageContent}    
                <button onClick={addBranch}>+</button>
            </div>
        </>
    )
    
}