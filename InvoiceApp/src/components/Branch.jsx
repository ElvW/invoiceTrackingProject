export default function Branch(props) {
    function removeBranch() {
        fetch(`https://localhost:7163/api/Branch/${props.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${props.userToken}`
            }
        }
        ).then(response => {
            if(response.ok) {
                props.setBranchList(prev => prev.filter(branch => branch.id !== props.id))
            } else {
                alert("something went wrong...")
            }
        })
    }
    
    return (
        <div className="branch-div">
            <p>{props.name}</p>
            <button onClick={removeBranch}>remove</button>
        </div>
    )
}