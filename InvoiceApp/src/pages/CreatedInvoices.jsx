import "../styles/CreatedInvoices.css"
import { useEffect, useState } from "react"

export default function CreatedInvoices(props) {
    const [invoiceList, setInvoiceList] = useState([])

    useEffect(() => {
        fetch("https://localhost:7163/api/Invoice", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${props.userToken}`
            }
        }).then(response => response.json()).then(
            data => data.filter(item => item.createdBy === props.userInfo.userId)
        ).then(
            data => setInvoiceList(data)
        )
    }, [])

    function removeInvoice(id) {
        fetch(`https://localhost:7163/api/Invoice/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${props.userToken}`
            }
        }).then(response => {
            if(response.ok) {
                setInvoiceList(prev => prev.filter(row => row.id !== id))
            } else {
                alert("something went wrong")
            }
        })
    }

    console.log(invoiceList)

    const pageContent = invoiceList.length !== 0 ?
    <div className="invoice-table">
        <table >
            <thead>
                <tr>
                    <th>Invoice No</th>
                    <th>Invoice Type</th>
                    <th>Invoice Date</th>
                    <th>KDV</th>
                    <th>Actions</th>
                </tr>    
            </thead>
            <tbody>
                {invoiceList.map(row => (<tr>
                    <td>{row.ettn}</td>
                    <td>{row.invoiceType}</td>
                    <td>{row.invoiceDate.split(["T"])[0]}</td>
                    <td>{
                        `%${row.invoiceLines[0].tax}`
                    }
                    </td>
                    <td onClick={() => removeInvoice(row.id)}><button>X</button></td>
                    </tr>))
                }
            </tbody>
        </table>
    </div>: <div className="invoice-table"><p>There is no invoice to display</p></div>

    return pageContent
}