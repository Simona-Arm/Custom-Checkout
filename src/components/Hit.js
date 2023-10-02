import {useHits} from "react-instantsearch";

const Hit = () => {
    const hits = useHits()
    console.log(hits)
    return <div>
        {hits.results.hits.map(({Price,Name,popularity},index)=>{
            return <div key={index}>
                <div>
                    <p><b>Name:</b> {Name}</p>
                    <p><b>Price:</b> {Price}</p>
                </div>
            </div>
        })}
    </div>
}

export default Hit;