"use client";
import ProjectsDropDownMenu from './projects-drop';
import { RedirectToSignIn, SignIn } from '@clerk/nextjs';
import { ArrowDown } from "lucide-react"
import { Code2 } from 'lucide-react';
import { Monitor } from 'lucide-react';
import MessageInput from './message-input';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import "@/components/ui/code-view/code-theme.css";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import If from "../../ifram";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import getUser from './getUser';
import type { User } from '@clerk/nextjs/server';
import { UserButton, useUser } from '@clerk/nextjs';
import { getExpectedRequestStore } from 'next/dist/server/app-render/work-unit-async-storage.external';
export default function ClientGreeting() {
  const [userId,setUserId]=useState("a")
  const {user,isSignedIn,isLoaded}= useUser()
  const router=useRouter()
useEffect(()=>{
if(user)setUserId(user.id)
  if (isLoaded && !isSignedIn) {
    router.push("/sign-in");
  }
},[user,isLoaded,isSignedIn,router])
  
  // console.log(user)
  //loading message init
  const [index, setIndex] = useState(0);
  const waitingMessages = [
    "Analyzing your ideas…",
    "Summoning pixels and code…",
    "Turning your vision into reality…",
    "Almost there… your website is waking up!",
    "Mixing creativity with AI magic…",
  ];
  const trpc = useTRPC();
  //fetching all projects 
  const {data:projects}= useSuspenseQuery(trpc.allProjects.queryOptions({userId:userId},{refetchInterval:3000}))
  //adding msg to db

  //getting project Id 
  const [projectId,setProjectId]=useState("")
  const path=usePathname()
useEffect(() => {
  setProjectId(path.substring(path.indexOf("/projects/")+"/projects/".length))
  return()=>clearInterval(id)
}, [ path]);
//fetching messages
const { data: messages, isLoading: load } = useSuspenseQuery(
  trpc.message.queryOptions(
    { value: projectId },
    {
      enabled:!!projectId,
      refetchInterval: 3000,
    }
  )
);
useEffect(()=>{console.log(projectId)},[projectId,messages])
  //looping waiting message index
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % waitingMessages.length);
    }, 3000);
    return () => clearInterval(id);
  }, [load]);
  //fetching sandboxUrl
  const [id, setId] = useState("");
  const [value, setValue] = useState("");
  const { data: frag, isLoading } = useSuspenseQuery(
    trpc.fragment.queryOptions(
      { value: id },
      {
        enabled: !!value,
      }
    )
  );
  // const [frag,setFrag]=useState(null)
  useEffect(()=>{
    if(messages&&messages.length>0){
      if(messages[messages.length-1].role=="ASSISTANT"){setId(messages[messages.length-1].id)}
    }
  },[messages])
  const [url, setUrl] = useState("");
  const [dataa, setData] = useState<typeof messages|null>(null);
  const invoke = useMutation(trpc.invoke.mutationOptions({}));
  const [sc,setSc]=useState<HTMLElement|null>()
  //scroll to last message on new message load 
  useEffect(() => {
    var sc = document.getElementById("msg");
    setSc(sc)
    if (sc) {
      sc.scrollTop = sc.scrollHeight;
    }
  }, [sc?.scrollHeight]);
  // setting messages 
  useEffect(() => {

    if(messages)setData(messages);
  }, [messages]);
  const handelClick = async (value: string) => {
    setId(value);
    if (frag) {
      setUrl(frag.sandboxUrl);
    }
  };
const createProject = useMutation(trpc.project.mutationOptions({onSuccess:(newProject) => {
    if (newProject) {
      setProjectId(newProject.id)
      router.push(`/projects/${newProject.id}`);
    }}}))
  return (
  <div className='bg-[#0F0F1A] h-[100vh] '>
    <div className='border-b-[rgba(255,255,255,0.09)] h-[10vh] w-full border-1 border-transparent flex  items-center'>
     <div className='text-3xl font-bold w-fit ml-3 '> <span>Buildify<span className='text-indigo-400'>AI</span></span></div>
        <div className='ml-auto mr-3 size-10'> <UserButton /> </div> 
    </div>
    <div className="flex my-4  w-full justify-around gap-5 bg-[#0F0F1A]">
 
      <div className="!w-[29vw] ml-2 bg-[#1A1A28] scroll-y overflow-y-auto  border-[rgba(255,255,255,0.09)] border-1 flex h-[85vh] rounded-md">
        <div
          id="msg"
          className="scroll-smooth t flex flex-col h-[70vh] overflow-y-auto gap-2   w-full"
        ><div className='sticky top-0 z-10 bg-black/70 '>
             <DropdownMenu >
            <DropdownMenuTrigger className="flex items-center justify-center ">
                Projects <ArrowDown/>
            </DropdownMenuTrigger>
            <DropdownMenuContent >
        {projects?.map((p)=><DropdownMenuItem key={p.id} onSelect={(e)=>{router.push(`/projects/${p.id}`)}}> {p.name}</DropdownMenuItem>

        )}
        <DropdownMenuItem onClick={async()=>await createProject.mutate({userId})}>New project </DropdownMenuItem>
            </DropdownMenuContent>

        </DropdownMenu></div>
          {dataa?.map((i) => (
            <div
              key={i.id}
              className={`flex rounded-md text-wrap w-4/5 p-2  mx-3   ${
                i.role !== "ASSISTANT" ? "bg-blue-600  self-end" : " text-[#E0E0E0] bg-gray-800 text-gray-100 self-start"
              }`}
            >
              {i.content}
              {i.role === "ASSISTANT" && (
                <Button className="ml-2" onClick={() => handelClick(i.id)}>
                  preview
                </Button>
              )}
            </div>
          ))}
          <div>
            {dataa&&dataa.length>1&&dataa[dataa.length - 1].role == "USER" && (
              <div className="animate-[fade_3s_ease-in-out_infinite] opacity-10">
                {waitingMessages[index]}
              </div>
            )}
          </div>
        </div>
        <div className="absolute flex bottom-[10vh] w-[30vw]">
          <MessageInput userId={userId} projectId={projectId} />
        </div>
      </div>
      {frag && typeof frag.files === "object" && frag.files !== null && (
        <div className=' w-[69vw] mr-2 border-[rgba(255,255,255,0.09)] border-1 bg-[#1A1A28] h-[85vh] rounded-md  overflow-hidden '>
          <Tabs defaultValue='preview' className='  '>
            <TabsList className='bg-black text-center'>
              <TabsTrigger className='' value="code"><Code2/> Code</TabsTrigger>
              <TabsTrigger value="preview" > <Monitor/> Preview</TabsTrigger>
            </TabsList>

            <TabsContent  className="  " value="code">
              <Tabs defaultValue='app/page.tsx' className="flex flex-row  ">
                <TabsList className="flex bg-black  text-white  flex-col h-full">
                  {Object.entries(frag.files).map(([filename, code]) => (
                    <TabsTrigger
                      key={filename}
                      value={filename}
                    
                    >
                      {filename}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.entries(frag.files).map(([filename, code]) => (
                  <TabsContent className=" h-[85vh] overflow-scroll overflow-x-hidden" key={filename} value={filename}>
  
      <SyntaxHighlighter 
      language="tsx"
      style={tomorrow} 
      showLineNumbers={true} 
      wrapLines={true} 
    >
      {String(code)}
    </SyntaxHighlighter>
                  </TabsContent>
                ))}
              </Tabs>
            </TabsContent>

            <TabsContent className="w-[70vw] h-[95vh] " value="preview">
              {!isLoading && <If url={frag.sandboxUrl} />}
            </TabsContent>
          </Tabs>
        </div>
      )}
      
    </div>
    </div>
  );
}

