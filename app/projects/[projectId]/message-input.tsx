"use Client"
import { ArrowUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/trpc/server";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import {useRouter} from "next/navigation";
import generateUniqueId from "generate-unique-id";

interface messageInputProps{
    projectId:string,
    placeHolder?:string
}

const MessageInput = ({ projectId, placeHolder }: messageInputProps) => {
    
    const [newId,setNewId]=useState(projectId)
    const router=useRouter()
    const [value,setValue]=useState("")
    const trpc= useTRPC()
  const invoke = useMutation(trpc.invoke.mutationOptions({}));
 useEffect(()=>{
    if(projectId==""){
        const id=generateUniqueId()
        setNewId(id)
    }
 },[])
    return ( 
 
          <div className=" items-center flex  h-12 w-full   text-white !bg-[#231F45]">
          <Input 
           onChange={(e) => setValue(e.target.value)}

          className=" w-full h-full  " 
         placeholder={placeHolder ?? "Ask genie to do something "}
           />
          <div></div><ArrowUp 
          onClick={async () => {
              toast.success("Button clicked!");
              await invoke.mutate({ projectId:newId, value: value });
              router.push(`/projects/${newId}`)
            }}
          className=" absolute right-1 border rounded-full size-7 text-center cursor-pointer text-[#020014] bg-white  "/>
           </div>
     );
}
 
export default MessageInput;