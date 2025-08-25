"use client"
// import MessageInput from "./projects/[projectId]/message-input";
import Nav from "@/components/ui/nav-menu";
import Link from "next/link";
import { Space_Grotesk } from "next/font/google";
import { useEffect, useState } from "react";
import Image from "next/image";
// import { Input } from "@/components/ui/input";
// import "./Lines.png"
// import "../../public/Lines.svg.png"
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { ArrowUp } from "lucide-react";
import MessageInput from "./projects/[projectId]/message-input";
import { useUser } from "@clerk/nextjs";
const spaceGrotesk=Space_Grotesk({
  subsets:["latin"],
  variable:"--font-space-grotesk"
})
const Page = () => {
  const {user,isLoaded,isSignedIn}=useUser()
    const [value,setValue]=useState("")
    const recommendations=[
        "Build a Landing Page for My Startup .",
  "Generate a Blog Website",
  "Build an E-commerce Store",
  "Make a Calculator App",
  "Create a Restaurant Website",
  "Build a SaaS Dashboard",
  "Generate a Landing Page for Event",
  "Create a Portfolio for a Photographer",
  "Build a To-Do List App"
    ]
    const [index,setIndex]=useState(0)
    const [deleting,setDelete ] = useState(false)
    const main="Ask genie to "
    const [placeholder,setPlaceholder]=useState("Ask Genie to ")
    const [wordIndex,setWordIndex]=useState(0)
  
    const [blink,setBlink]=useState(false)
    useEffect(()=>{
      const id=setTimeout(()=>setBlink((prev)=>!prev),100)
      return ()=>clearTimeout(id)
    },[blink])
    const m=blink?"|":""
    useEffect(()=>{
      let speed=deleting?20:50
      
     const id= setTimeout(()=>{
setWordIndex((prev)=>deleting?prev-1:prev+1)
setPlaceholder(main+recommendations[index].substring(0,wordIndex)+m);
if(wordIndex==recommendations[index].length)setDelete(true)
if(wordIndex==0 ){setIndex((prev)=>(prev+1)%recommendations.length);setTimeout(()=>setDelete(false),300)}
},speed)
console.log(index)
return ()=>clearTimeout(id)
    },[wordIndex,index,deleting])
    return ( 
        <div className="    text-black flex bg-white  flex-col  items-center   h-[100vh] w-[100vw]">
            <img className="w-full absolute h-full" alt="bg image" src="./Lines.svg.png"/>
            <div className= " top-0    h-[100vh] w-full  bg-[#27234D] "> </div>
     <Nav/>
          <div className="absolute top-0 z-[1] w-full h-[100vh] bg-black/70"></div>
     <div className="absolute top-25 z-10  bg-gradient-to-r from-[#CAA9D3] to-[#B7D6EF] font-bold via-[#828ED6] text-transparent bg-clip-text">Next-generation of Site building </div>
           <div className="absolute w-full h-full  z-[0]">
            <div className=" blur-xl absolute  z-[2] left-[15%] top-[20%]  size-40 rounded-full bg-[#4E4B3D]" ></div>
            <div className="blur-xl  size-40 rounded-full absolute top-[70%] right-[10%] bg-[#4E4B3D]/60"></div>
            <div className=" blur-xl absolute right-[15%] top-[20%] size-40 rounded-full bg-[#3B4A45]"></div>
            <div className=" absolute left-[15%] bottom-[20%]  size-40 rounded-full blur-xl bg-[#543D5D]/79"> </div>
       </div>
       <div className=" items-center flex absolute bottom-[25%] h-12 w-1/2 z-10 text-white ">
          <MessageInput userId={user?user.id:""} placeHolder={placeholder} projectId=""/>
           </div>
            <h1 className={`font-bold text-9xl absolute z-10 text-center text-white top-55`}>AI-Powered <br />Site Builder⚡</h1>
        </div>
     );
}
 
export default Page;