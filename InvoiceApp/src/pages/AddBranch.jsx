import { useState } from "react"
import"../styles/AddBranch.css"
import { useNavigate } from "react-router-dom"

export default function AddBranch(props) {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        ettn: "null",
        companyId: props.chosenCompany
    })
    
    function handleChange(name, value) {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    function handleForm(e) {
        e.preventDefault()
        fetch("https://localhost:7163/api/Branch", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${props.userToken}`
            }
        }).then(response => {
            if(response.ok) {
                alert("Branch has been added!")
                navigate("/companies")
            } else {
                alert("Something went wrong...")
            }
        })
    }

    return (
        <>
            <form className="create-branch" onSubmit={handleForm}>
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} required/>
                <button>Create!</button>
            </form>
        </>
    )
}