import {useHits} from "react-instantsearch";

const Hit = () => {
    const hits = useHits()
    console.log(hits)
    return <div>
        {hits.results.hits.map(({brand,name,image,popularity})=>{
            return <div key={popularity}>
                <div>
                    <p>Name: {name}</p>
                    <p>Brand: {brand}</p>
                </div>
                <div>
                    <img src={image}/>
                </div>
            </div>
        })}
    </div>
}

export default Hit;