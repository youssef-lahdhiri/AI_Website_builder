import {z} from 'zod';
import { inngest } from '@/inngest/client';
import prisma from '@/lib/db';
import {createTRPCRouter, baseProcedure} from '../init';
export const appRouter = createTRPCRouter({
  msgCreate:baseProcedure.input
  (z.object({id:z.string(),content:z.string().min(1,"write a valid message")})).query(async({input})=>{
    const message=await prisma.message.create({
      data:{
        content:input.content,
        projectId:input.id,
        role:"USER",
      type:"RESULT"      }
    })
  }),
  fragment:baseProcedure.input(z.object({value:z.string()})).query(async({input})=>{
    const frag=await prisma.fragment.findFirst({where:{messageId:input.value}})
    if(!frag)return null
    return frag
  }),
  message:baseProcedure
  .input(z.object({value:z.string()}))
  .query(async({input})=>{
    const project=await prisma.project.findFirst({where:{name:input.value}})
    const messages=await prisma?.message.findMany({where:{projectId:project.id}})
  return messages}),
  project:baseProcedure.query(async()=>{
    const project=await prisma?.project.findFirst({where:{asb:1}})
 return project
  }),
  invoke: baseProcedure.input(z.object({projectId:z.string(), value: z.string() })).mutation(async ({ input  }) => {
    // await prisma.message.create({data:{content:input.value,type:"RESULT",role:"USER"}})
    await inngest.send({
      name: "test/hello.world",
      data: {
        projectId:input.projectId,
        value: input.value,
      },
    });
    return { message: `Hello ${input.value}!` };  
  }),
  asba: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return { id: input.id, name: `yedek f zeby ${input.id}` };
    }),
});
export type AppRouter = typeof appRouter;