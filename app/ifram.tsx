"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";
import { Copy } from "lucide-react";
import { RefreshCcw } from "lucide-react";
const If = ({url}:{url:string}) => {
  const [urll, setUrl] = useState("");
  useEffect(()=>{setUrl(url)},[url,urll])  
  const handelCopy=()=>{
 navigator.clipboard.writeText(urll);
                setCopied(true)
                setTimeout(()=>{setCopied(false)},1000)
  }
const [copied,setCopied]=useState(false)
  return (
    <><div className="float-right  w-full">
        <div className="flex  ">
            <p  onClick={()=>{setUrl("");}} className=" cursor-pointer text-center flex justify-center items-center"><RefreshCcw/></p>
            <p onClick={handelCopy} className=" cursor-pointer text-center flex justify-center items-center">{copied?<Check/>:<Copy/>}</p>
    <Input className="text-center" value={urll} readOnly/> </div>
  {urll!=""?<iframe id="ifram"   className="h-[89.8vh] w-full scale-[ 0.75]  top-0 left-0 origin-top-left "   src={urll}></iframe>:null}
    </div></>
  );
};

export default If;
