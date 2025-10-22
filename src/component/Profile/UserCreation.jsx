import React, {useEffect,useState} from 'react'

const UserCreation = ({ userId = "USER-17468269976523805" }) => {
    const [loadings, setLoadings] = useState(true);
    const BASE_URLI = "https://api.votecity.ng/v1/shot/user"
    const [userCreate, setUserCreate] = useState(null);
    const [shots, setShots] = useState([])

    useEffect(() => {
        console.log("userId:", userId);
        fetch(`${BASE_URLI}/${userId}`)
            .then((res) => {
                console.log("res:", res.status);
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then((data) => {
                console.log("Shot Data:", data)
                const fetchedShots = data?.data?.shots || [];
                setShots(fetchedShots);
                console.log("shots:", fetchedShots);
            })
            .catch((err) => console.error("Fetch error:", err))
            .finally(() => setLoadings(false));
    }, [userId]);
  return (
    <div>
        j
     {shots.length === 0 ? (
         <p>No shots available</p>
     ) : (
         shots.map((shot, index) => (
             <div key={shot.shot_id || index}>
                 <img
                     src={`https://api.votecity.ng${user.thumbnail.url}`}
                     alt={`Shot ${index + 1}`}
                     width="200"
                 />
                 <p>{shot.text}</p>
             </div>
         ))
     )}
 </div>
  ) 
}

export default UserCreation