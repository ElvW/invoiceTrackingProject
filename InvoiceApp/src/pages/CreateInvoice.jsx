import "../styles/CreateInvoice.css"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Select from "react-select"

export default function CreateInvoice(props) {
    const navigate = useNavigate()
    const [companyList, setCompanyList] = useState([])
    const [branches, setBranches] = useState([])
    const now = new Date()
    const hour = String(now.getHours()).padStart(2, "0")
    const minute = String(now.getMinutes()).padStart(2, "0")
    const options = companyList.map(c => ({value: c.id, label: c.name}))
    const branchOptions = branches.map(b => ({value: b.id, label: b.name}))
    const [selectedCompany, setSelectedCompany] = useState(null)
    const [formData, setFormData] = useState({
        branch: "",
        ettn: "",
        invoicePrefix: "",
        scenario: "",
        invoiceType: "",
        invoiceDate: new Date().toISOString().split("T")[0],
        invoiceHour: `${hour}:${minute}`,
        currencyType: "",
        orderNo: "",
        orderDate: "",
        vknTckn: "",
        name: "",
        taxOffice: "",
        country: "",
        province: "",
        district: "",
        address: "",
        email: "",
        postalCode: "",
        website: "",
        phone: "",
        fax: ""
    })
    const [rows, setRows] = useState([])

    useEffect(() => {
        fetch("https://localhost:7163/api/Branch", {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${props.userToken}`
            }
        }).then(response => response.json()).then(
            data => data.filter(item => item.createdBy === props.userInfo.userId && item.companyId === props.chosenCompany)
        ).then(data => setBranches(data))
    }, [])

    useEffect(() => {
        fetch("https://localhost:7163/api/Company", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${props.userToken}` 
            }
        }).then(response => response.json()).then(
            data => data.filter(item => item.userId !== props.userInfo.userId)
        ).then(
            data => setCompanyList(data)
        )
    }, [])

    const customStyles = {
        control: (provided) => ({
            ...provided,
            minHeight: "20px",   // ensures consistent height
            height: "20px",      // sets explicit height
            borderRadius: "0px", // adjust to match your inputs
            fontSize: "14px",    // smaller readable text
            padding: "0 4px",    // subtle inner padding
        }),
        valueContainer: (provided) => ({
            ...provided,
            height: "20px",
            padding: "0 4px",
        }),
        input: (provided) => ({
            ...provided,
            margin: "0px",
            padding: "0px",
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            height: "20px",
        }),
        container: base => ({
            ...base,
            borderRadius: "0",
            width: '100%',
        }),

        menu: base => ({
            ...base,
            color: "#1B3C53",
        })
    };

    function addRow() {
        setRows(prev => ([
            ...prev,
            {
                id: crypto.randomUUID(),
                productName: "",
                quantity: "",
                unit: "",
                unitPrice: "",
                discountRate: "",
                discountAmount: "",
                productAmount: "",
                kdvRate: "",
                kdvAmount: "",
                exemption: "",
            }

        ]))
    }
 
    function handleChangeForm(field, value) {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    function handleChangeTable(id, field, value) {
        if(field === "kdvRate") {
            const row = rows.find(item => item.id === id)
            const discountAmount = Math.round(Number(row.unitPrice) * 100 * Number(row.discountRate) / 100) / 100
            const serviceAmount = Math.round((Number(row.unitPrice) - discountAmount) * 100) / 100
            const kdvAmount = Math.round(serviceAmount * 100 * Number(value) / 100) / 100

            
            setRows(rows => (rows.map(row => (
                row.id === id ? {...row, discountAmount: discountAmount, productAmount: serviceAmount, kdvAmount: kdvAmount }: row
            ))))
        }

        setRows(rows => (rows.map(row => (
            row.id === id ? {...row, [field]: value}: row
        ))))
    }

    function handleSubmit(e) {
        e.preventDefault()
        const invoiceLines = rows.map(item => ({
            product: item.productName,
            amount: Number(item.quantity),
            unit: item.unit,
            price: Number(item.unitPrice),
            discountPercent: Number(item.discountRate),
            discountAmount: Number(item.discountAmount),
            tax: Number(item.kdvRate),
            taxAmount: Number(item.kdvAmount),
            userNote: item.exemption
        }))

        const combinedData = {
            branchId: formData.branch.value,
            ettn: formData.ettn,
            orderNumber: Number(formData.orderNo),
            invoicePrefix: formData.invoicePrefix,
            scenario: formData.scenario,
            invoiceType: formData.invoiceType,
            invoiceDate: formData.invoiceDate,
            currency: formData.currencyType,
            country: formData.country,
            provience: formData.province,
            district: formData.district,
            address: formData.address,
            postalCode: formData.postalCode,
            website: formData.website,
            fax: formData.fax,
            phone: formData.phone,
            invoiceLines: invoiceLines
        }

        console.log(combinedData)

        fetch("https://localhost:7163/api/Invoice", {
            method: "POST",
            body: JSON.stringify(combinedData),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${props.userToken}`
            }
        }).then(response => {if(response.ok){
            alert("Invoice has been created!")
            navigate("/createdInvoices")
        } else {
            alert("Something went wrong, please try again.")
        }})
    }
    
    function removerRow(id) {
        setRows(rows => rows.filter(row => row.id !== id))
    }

    function handleSelect(selectedOption) {
        if(!selectedOption) {
            setSelectedCompany(null)
            setFormData(prev => ({
                ...prev,
                vknTckn: "",
                name: "",
                taxOffice: "",
                country: "",
                province: "",
                district: "",
                address: "",
                email: "",
                postalCode: "",
                website: "",
                phone: "",
                fax: ""
            }))

            return
        }

        setSelectedCompany(selectedOption)
        const company = companyList.find(c => c.id === selectedOption.value)
        setFormData(prev => ({
            ...prev,
            name: company.name,
            email: company.email,
            website: company.website,
            phone: company.phone,
            vknTckn: company.vkn,
            taxOffice: company.taxOffice,
            country: company.country,
            province: company.province,
            district: company.district,
            address: company.address,
            postalCode: company.postalCode,
            fax: company.fax
        }))
    }

    function handleBranchSelect(selectedOption) {
        setFormData(prev => ({
            ...prev,
            branch: selectedOption
        }))
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="create-invoice-form">
                <p>Invoice Info</p>
                <div className="invoice-info-form">
                    <div>
                        <label htmlFor="branch">Branch</label>
                        <Select styles={customStyles} options={branchOptions} name="branch" id="branch" value={formData.branch} onChange={handleBranchSelect}/>
                    </div>

                    <div>
                        <label htmlFor="ettn">ETTN</label>
                        <input type="text" name="ettn" id="ettn" value={formData.ettn} onChange={(e) => (handleChangeForm('ettn', e.target.value))}/>
                    </div>

                    <div>
                        <label htmlFor="invoicePrefix">Invoice Prefix</label>
                        <input type="text" name="invoicePrefix" id="invoicePrefix" value={formData.invoicePrefix} onChange={(e) => (handleChangeForm('invoicePrefix', e.target.value))}/>
                    </div>

                    <div>
                        <label htmlFor="scenario">Scenario</label>
                        <select name="scenario" id="scenario" value={formData.scenario} onChange={(e) => (handleChangeForm('scenario', e.target.value))}>
                            <option value="Basic Invoice">Basic Invoice</option>
                            <option value="Commercial Invoice">Commercial Invoice</option>
                            <option value="Export Invoice">Export Invoice</option>
                            <option value="Passenger-associated Invoice">Passenger Associated Invoice</option>
                            <option value="Public Invoice">Public Invoice</option>
                            <option value="Wholesale Market Registration System">Wholesale Market Registration system</option>
                            <option value="Pharmaceutical and Medical device">Pharmaceutical and Medical device</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="invoiceType">Invoice Type</label>
                        <select type="text" name="invoiceType" id="invoiceType" value={formData.invoiceType} onChange={(e) => (handleChangeForm('invoiceType', e.target.value))}>
                            <option value="Sales">Sales</option>
                            <option value="Exception">Exception</option>
                            <option value="Return">Return</option>
                            <option value="Withholding">Withholding</option>
                            <option value="Withholding Refund">Withholding Refund</option>
                            <option value="Special Base">Special Base</option>
                            <option value="Export Registered">Export Registered</option>
                            <option value="SGK">SGK</option>
                            <option value="Accommodation Tax">Accommodation Tax</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="invoiceDate">Invoice Date</label>
                        <input type="date" name="invoiceDate" id="invoiceDate" value={formData.invoiceDate} onChange={(e) => (handleChangeForm('invoiceDate', e.target.value))}/>
                    </div>

                    <div>
                        <label htmlFor="invoiceHour">Invoice Hour</label>
                        <input type="time" name="invoiceHour" id="invoiceHour" value={formData.invoiceHour} onChange={(e) => (handleChangeForm('invoiceHour', e.target.value))}/>
                    </div>

                    <div>
                        <label htmlFor="currencyType">Currency Type</label>
                        <select name="currencyType" id="currencyType" value={formData.currencyType} onChange={(e) => (handleChangeForm('currencyType', e.target.value))}>
                            <option value="TRY">TRY</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="orderNo">Order No</label>
                        <input type="text" name="orderNo" id="orderNo" value={formData.orderNo} onChange={(e) => (handleChangeForm('orderNo', e.target.value))}/>
                    </div>

                    <div>
                        <label htmlFor="orderDate">Order Date</label>
                        <input type="text" name="orderDate" id="orderDate" value={formData.orderDate} onChange={(e) => (handleChangeForm('orderDate', e.target.value))}/>
                    </div>
                </div>

                <p>Company Info</p>

                <div className="company-info-form">
                    <div>
                        <label htmlFor="search">Search</label>
                        <Select styles={customStyles} name="search" id="search" value={selectedCompany} options={options} onChange={handleSelect} isClearable/>
                    </div>

                    <div>
                        <label htmlFor="vknTckn">VKN/TCKN</label>
                        <input type="text" name="vknTckn" id="vknTckn" value={formData.vknTckn} onChange={(e) => (handleChangeForm('vknTckn', e.target.value))}/>
                    </div>

                    <div>
                        <label htmlFor="name">Company Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={(e) => (handleChangeForm('name', e.target.value))}/>
                    </div>

                    <div>
                        <label htmlFor="taxOffice">Tax Office</label>
                        <input type="text" name="taxOffice" id="taxOffice" value={formData.taxOffice} onChange={(e) => (handleChangeForm('taxOffice', e.target.value))}/>
                    </div>

                    <div>
                        <label htmlFor="country">Country</label>
                        <input type="text" name="country" id="country" value={formData.country} onChange={(e) => (handleChangeForm('country', e.target.value))}/>
                    </div>

                    <div>
                        <label htmlFor="province">Province</label>
                        <input type="text" name="province" id="province" value={formData.province} onChange={(e) => (handleChangeForm('province', e.target.value))}/>
                    </div>

                    <div>
                        <label htmlFor="district">District</label>
                        <input type="text" name="district" id="district" value={formData.district} onChange={(e) => (handleChangeForm('district', e.target.value))}/>
                    </div>

                    <div>
                        <label htmlFor="address">Address</label>
                        <input type="text" name="address" id="address" value={formData.address} onChange={(e) => (handleChangeForm('address', e.target.value))}/>
                    </div>

                    <div>
                        <label htmlFor="email">E-Mail</label>
                        <input type="text" name="email" id="email" value={formData.email} onChange={(e) => (handleChangeForm('email', e.target.value))}/>
                    </div>

                                        <div>
                        <label htmlFor="postalCode">Postal Code</label>
                        <input type="text" name="postalCode" id="postalCode" value={formData.postalCode} onChange={(e) => (handleChangeForm('postalCode', e.target.value))}/>
                    </div>

                    <div>
                        <label htmlFor="website">Website</label>
                        <input type="text" name="website" id="website" value={formData.website} onChange={(e) => (handleChangeForm('website', e.target.value))}/>
                    </div>

                    <div>
                        <label htmlFor="phone">Phone</label>
                        <input type="text" name="phone" id="phone" value={formData.phone} onChange={(e) => (handleChangeForm('phone', e.target.value))}/>
                    </div>

                    <div>
                        <label htmlFor="fax">Fax</label>
                        <input type="text" name="fax" id="fax" value={formData.fax} onChange={(e) => (handleChangeForm('fax', e.target.value))}/>
                    </div>
                </div>

                <p>Invoice Lines</p>

                <div className="invoice-lines">
                    <button type="button" onClick={addRow}>Add a new line</button>
                    <table>
                        <thead>
                            <tr>
                                <th>Index No</th>
                                <th>Product/Service Name</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                                <th>Unit Price</th>
                                <th>Discount Rate</th>
                                <th>Discount Amount</th>
                                <th>Product/Sercive Amount</th>
                                <th>KDV Rate</th>
                                <th>KDV Amount</th>
                                <th>Exemption</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows ? rows.map((row, index) => (
                                <tr key={row.id}>
                                    <td>
                                        {index + 1}
                                    </td>
                                    <td>
                                        <input type="text" value={row.productName} onChange={e => handleChangeTable(row.id, "productName", e.target.value)} />
                                    </td>
                                    <td>
                                        <input type="text" min={0} value={row.quantity} onChange={e => handleChangeTable(row.id, "quantity", e.target.value)} />
                                    </td>
                                    <td>
                                        <input type="text" value={row.unit} onChange={e => handleChangeTable(row.id, "unit", e.target.value)} />
                                    </td>
                                    <td>
                                        <input type="text" min={0} value={row.unitPrice} onChange={e => handleChangeTable(row.id, "unitPrice", e.target.value)} />
                                    </td>
                                    <td>
                                        <input type="text" min={0} value={row.discountRate} onChange={e => handleChangeTable(row.id, "discountRate", e.target.value)} />
                                    </td>
                                    <td>
                                        <input type="text" value={row.discountAmount} onChange={e => handleChangeTable(row.id, "discountAmount", e.target.value)} />
                                    </td>
                                    <td>
                                        <input type="text" value={row.productAmount} onChange={e => handleChangeTable(row.id, "productAmount", e.target.value)} />
                                    </td>
                                    <td>
                                        <select type="text" value={row.kdvRate} onChange={e => handleChangeTable(row.id, "kdvRate", e.target.value)}>
                                            <option value="0">0</option>
                                            <option value="1">1</option>
                                            <option value="8">8</option>
                                            <option value="10">10</option>
                                            <option value="18">18</option>
                                            <option value="20">20</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input type="text" value={row.kdvAmount} onChange={e => handleChangeTable(row.id, "kdvAmount", e.target.value)} />
                                    </td>
                                    <td>
                                        <input type="text" value={row.exemption} onChange={e => handleChangeTable(row.id, "exemption", e.target.value)} />
                                    </td>
                                    <td>
                                        <button onClick={() => removerRow(row.id)}>X</button>
                                    </td>
                                </tr>
                            )): null}
                        </tbody>
                    </table>
                </div>

                <button type="submit">Create Invoice</button>
            </form>
        </>
    )
}