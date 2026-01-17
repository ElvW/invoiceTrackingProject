import { useState } from "react" 
import { useNavigate } from "react-router-dom"
import "../styles/AddCompany.css"

  export default function AddCompany(props) {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: "",
        vkn: "",
        email: "",
        taxOffice: "",
        country: "",
        province: "",
        district: "",
        address: "",
        postalCode: "",
        phone: "",
        website: "",
        fax: ""
    })

    function handleChange(name, value){
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    
    function handleForm(e) {
        e.preventDefault()
        fetch("https://localhost:7163/api/Company", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${props.userToken}`
				}
        }).then(response => {
            if(response.ok){
                alert(`Company ${formData.name} has been created!`)
                navigate("/companies")
            } else {
                alert('Something went wrong...')
            }
        })
    }

    return (
        <div className="form-container">
            <p>Commpany Info</p>
            <form id="add-company-form" className="add-company-form" onSubmit={handleForm}>
                <div>
                    <label htmlFor="companyName">Company Name</label>
                    <input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} type="text" name="companyName" id="companyName" required />
                </div>
                
                <div>
                    <label htmlFor="vknTckn">VKN/TCKN</label>
                    <input value={formData.vkn} onChange={(e) => handleChange("vkn", e.target.value)} type="text" name="vknTckn" id="vknTckn" required/>
                </div>
                
                <div>
                    <label htmlFor="taxOffice">Tax Office</label>
                    <input value={formData.taxOffice} onChange={(e) => handleChange("taxOffice", e.target.value)} type="text" name="taxOffice" id="taxOffice" required />
                </div>

                <div>
                    <label htmlFor="country">Country</label>
                    <input value={formData.country} onChange={(e) => handleChange("country", e.target.value)} type="text" name="country" id="country" required />
                </div>
                
                <div>
                    <label htmlFor="province">Province</label>
                    <input value={formData.province} onChange={(e) => handleChange("province", e.target.value)} type="text" name="province" id="province" required />
                </div>
                
                <div>
                    <label htmlFor="district">District</label>
                    <input value={formData.district} onChange={(e) => handleChange("district", e.target.value)} type="text" name="district" id="district" required />
                </div>
                
                <div>
                    <label htmlFor="address">Address</label>
                    <input value={formData.address} onChange={(e) => handleChange("address", e.target.value)} type="text" name="address" id="address" required />
                </div>
                
                <div>
                    <label htmlFor="email">E-mail</label>
                    <input value={formData.email} onChange={(e) => handleChange("email", e.target.value)} type="email" name="email" id="email" required />
                </div>
                
                <div>
                    <label htmlFor="postalCode">Postal Code</label>
                    <input value={formData.postalCode} onChange={(e) => handleChange("postalCode", e.target.value)} type="text" name="postalCode" id="postalCode" required />
                </div>
                
                <div>
                    <label htmlFor="website">Website</label>
                    <input value={formData.website} onChange={(e) => handleChange("website", e.target.value)} type="text" name="website" id="website" required />
                </div>
                
                <div>
                    <label htmlFor="phone">Phone</label>
                    <input value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} type="text" name="phone" id="phone" required />
                </div>
                
                <div>
                    <label htmlFor="fax">Fax</label>
                    <input value={formData.fax} onChange={(e) => handleChange("fax", e.target.value)} type="text" name="fax" id="fax" required />
                </div>
                <button>Add Company</button>
            </form>
        </div>          
    )
}