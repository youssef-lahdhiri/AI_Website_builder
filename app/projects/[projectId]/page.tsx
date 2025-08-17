"use client";
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
import { usePathname } from "next/navigation";
import If from "../../ifram";
export default function ClientGreeting() {
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
 
  //adding msg to db

  //getting project Id from url
  let projectId = usePathname();
  projectId = projectId.slice(new String("/projcets/").length);
  //fetching messages
  const { data: messages, isLoading: load } = useSuspenseQuery(
    trpc.message.queryOptions(
      { value: projectId },
      {
        refetchInterval: 3000,
      }
    )
  );
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
    if(messages){
      if(messages[messages.length-1].role=="ASSISTANT"){setId(messages[messages.length-1].id)}
    }
  },[messages])
  const [url, setUrl] = useState("");
  const [dataa, setData] = useState([{ content: "", role: "", id: "" }]);
  const invoke = useMutation(trpc.invoke.mutationOptions({}));
  var sc = document.getElementById("msg");
  //scroll to last message on new message load 
  useEffect(() => {
    if (sc) {
      sc.scrollTop = sc.scrollHeight;
    }
  }, [sc?.scrollHeight]);
  // setting messages 
  useEffect(() => {
    setData(messages);
  }, [messages]);
  const handelClick = async (value: string) => {
    setId(value);
    if (frag) {
      setUrl(frag.sandboxUrl);
    }
  };
  return (
    <div className="flex !bg-[#0F0F1A]">
      <div className="!w-[30vw] border-[#0F0F1A] border-r-white  border-1 flex h-[100vh]">
        <div
          id="msg"
          className="scroll-smooth flex flex-col overflow-y-hidden h-[95vh] gap-2   w-full"
        >
          {dataa?.map((i) => (
            <div
              key={i.id}
              className={`flex rounded-md w-fit p-2  ${
                i.role !== "ASSISTANT" ? "bg-[#4A3FA3] self-end" : " text-[#E0E0E0] bg-[#3B365E] self-start"
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
            {dataa[dataa.length - 1].role == "USER" && (
              <div className="animate-[fade_3s_ease-in-out_infinite] opacity-10">
                {waitingMessages[index]}
              </div>
            )}
          </div>
        </div>
        <div className="absolute flex bottom-0 w-[30vw]">
          <MessageInput projectId={projectId} />
        </div>
      </div>
      {frag && typeof frag.files === "object" && frag.files !== null && (
        <div className=' w-[70vw]  overflow-hidden '>
          <Tabs defaultValue='preview' className='  '>
            <TabsList className='bg-black'>
              <TabsTrigger value="code">code</TabsTrigger>
              <TabsTrigger value="preview">preview</TabsTrigger>
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
                  <TabsContent className=" h-[95vh] overflow-scroll overflow-x-hidden" key={filename} value={filename}>
  
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
  );
}
function componentDidMount() {
  throw new Error("Function not implemented.");
}

