import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

export const MessageRouter=createTRPCRouter({
create:baseProcedure
.input(z.object({value:z.string()}))


})