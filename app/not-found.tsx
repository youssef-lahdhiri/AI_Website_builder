"use client"

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Error = () => {
    const router=useRouter()
    // useEffect(()=>{
    //     router.push('/projects')
    // },[])
    return ( 
        <div>An error has occured </div>
     );
}
 
export default Error;