
import { inngest } from "./client";
import { Agent, openai, createAgent, createTool, createNetwork } from "@inngest/agent-kit";
import {Sandbox } from "@e2b/code-interpreter"
import { getSandbox, lastAssistanTextMessageContext } from "./utlis";
import prisma from "@/lib/db";
import { z } from "zod";
import { PROMPT } from "@/prompt";
export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event,step }) => {
    let project=await prisma.project.findFirst({where:{name:event.data.projectId}})
    if(!project){
      project=await prisma.project.create({
        data:{
          name:event.data.projectId,
        }
      })
    }
    const createMessage=async()=>{await prisma.message.create({
      data:{
          role:"USER",
          type:"RESULT",
          content:event.data.value,
          projectId:project.id
        }
      })}
    const msg= await prisma.message.findFirst({
      orderBy:[{CreatedAt:"desc"}],
      where:{
        content:event.data.value,
        projectId:project.id,
      }
    })
    if(msg){
   if( !(Date.now()-  new Date(msg.CreatedAt).getTime()<=120*1000)){createMessage()}
    }else{createMessage()}
    
  const sandboxId= await step.run("get-sandbox-id",async()=>{
    const sandbox=await Sandbox.create( "next-js-test0-2")
    //change sandbox timeout 
    // sandbox.setTimeout(900_000)
    return sandbox.sandboxId;
  }) 
 
     const codeAgent=createAgent({
      name: "code agent",
      description:"an Expert coding agent  ",
system:PROMPT,
      model: openai({model:"gpt-4.1",
        defaultParameters:{
          temperature:0.1,
        }
      }),
      tools:[
        createTool({
          name:"terminal",
          description:"use Terminal to run Commands.",
          parameters:z.object({
            command:z.string()
          }),
          handler:async({command},{step})=>{
            return await step?.run("terminal",async()=>{
              const buffers={stdout:"",stderr:""}
              try{
                const sandbox= await getSandbox(sandboxId)
                const result =await sandbox.commands.run(command,{
                  onStdout:(data:string)=>{buffers.stdout+=data},
                  onStderr:(data:string)=>{buffers.stderr+=data}}
                  
                )
      return result.stdout;
              }catch( e){
                  console.error(`command failed ${e} \nstdout:${buffers.stdout} \nstderr: ${buffers.stderr}`)
                  return `command failed ${e} \nstdout:${buffers.stdout} \nstderr: ${buffers.stderr}`
              }
            })
          }
        }),
        createTool({
          name:"createOrUpdateFiles",
          description:"create or update Files in the Sandbox",
          parameters:z.object({
            files:z.array(
              z.object({
                path:z.string(),
                content:z.string()

              })
            )
          }),
          handler:async({files},{step,network})=>{
            const newFiles=await step?.run("createOrUpdateFiles",async()=>{
              try{
                const updatedFiles= network.state.data.files ||{}
                const sandbox=await getSandbox(sandboxId);
                for (const file of files){
                  await sandbox.files.write(file.path,file.content)
                  updatedFiles[file.path]=file.content;
                }
                return updatedFiles
              }catch(e){return "error"+e}
            }) 
            if (typeof newFiles=="object"){
              network.state.data.files=newFiles;
            }

          }

        }),
        createTool({
          name:"readFiles",
          description:"Read Files from the Sandbox",
          parameters:z.object({
            files:z.array(z.string())
          }),
          handler:async({files},{step})=>{
            return await step?.run("read-files",async()=>{
              try{
  
                const sandbox=await getSandbox(sandboxId)
                const contents =[];
                for(const file of files){
                  const content=await sandbox.files.read(file)
                  contents.push({path:file,content})
                
                }
                return JSON.stringify(contents)
              }catch(e){return "error"+e}
            })
          }
     
      
    })
      ],
      lifecycle:{
        onResponse:async({result,network})=>{
          const lastAssistantMessageText=lastAssistanTextMessageContext(result)
          if (lastAssistantMessageText&&network){
            if(lastAssistantMessageText.includes("<task_summary>")){
              network.state.data.summary=lastAssistantMessageText
            }
            }
            return result 
          }
        }
      
    });
    const network= createNetwork({
      name:"conding-agent-network",
      agents:[codeAgent],
      maxIter:15,
      router:async({network})=>{
        const summary=network.state.data.summary;
        if (summary){return summary}
        return codeAgent
      }
    })
    const result = await network.run(event.data.value)
    const sandboxUrl=await step.run("get-sandbox-url",async()=>{
      const sandbox=await getSandbox(sandboxId)
      const host= sandbox.getHost(3000)
      
return `https://${host}`
    })
    const message2=await prisma.message.create({
        data:{
          content:result.state.data.summary,
          role:"ASSISTANT",
          type:"RESULT",
          projectId:project.id
        }
      })
      await prisma.fragment.create({data:{files:result.state.data.files,sandboxUrl:sandboxUrl,title:"as",messageId:message2.id}})
    return { url:sandboxUrl ,
      title:"Fragment",
      files:result.state.data.files,
      summary:result.state.data.summary
    };
  },
);
