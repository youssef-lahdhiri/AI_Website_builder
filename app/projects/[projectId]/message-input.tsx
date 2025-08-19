"use Client"
import { ArrowUp, SendIcon } from "lucide-react";
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
    userId:string
}

const MessageInput = ({ projectId, placeHolder,userId }: messageInputProps) => {
    
    const [newId,setNewId]=useState(projectId)
    const router=useRouter()
    const [value,setValue]=useState("")
    const trpc= useTRPC()
  const invoke = useMutation(trpc.invoke.mutationOptions({}));
  const project= useMutation(trpc.project.mutationOptions({}))

 
    return ( 
 
          <div className=" items-center flex justify-center gap-3  h-12 w-full   text-white ">
          <Input 
           onChange={(e) => setValue(e.target.value)}
value={value}
          className=" w-2/3 h-full  !bg-[#231F45] " 
         placeholder={placeHolder ?? "Ask genie to do something "}
           />
          <button onClick={async () => {
              toast.success("Button clicked!");
             if(projectId=="") {const id =await project.mutateAsync({userId:userId});
             
             await invoke.mutateAsync({ projectId:id.id, value: value,userId:userId });
                           router.push(`/projects/${id.id}`)

             }else{
                           await invoke.mutate({ projectId:projectId, value: value,userId:userId });

                           router.push(`/projects/${projectId}`)
             }
              setValue("")
            }} className=" cursor-pointer text-center m-1 bg-black h-full w-12 flex items-center justify-center rounded-md"> <SendIcon 
          
            // className=" absolute right-1 border rounded-full size-7 text-center cursor-pointer text-[#020014] bg-white  "/>
         />
          </button> </div>
     );
}
 
export default MessageInput;