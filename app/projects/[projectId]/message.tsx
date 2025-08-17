// import { Button } from "@/components/ui/button";
// const Message = ({dataa}) => {
//     return ( 

//           <div id="msg"  className="scroll-smooth  flex flex-col  overflow-scroll h-[80vh] gap-2  grow shrink-0 w-full  ">
//       {/* {dataa?.map((i)=><div key={i.id}
//       className={i.role!="ASSISTANT"?"justify-end flex bg-gray-200 rounded-[5px]  w-fit p-1 "
//       :"bg-gray-200 justify-start flex rounded-[5px] p-1 border-1 border-black"} >
// {i.content}  
// {i.role=="ASSISTANT"? <Button onClick={()=>{handelClick(i.id)}}>prview</Button>:null}      
//         </div>)} */}
//         {dataa?.map((i) => (
//   <div
//     key={i.id}
//     className={`flex ${i.role !== "ASSISTANT" ? "justify-end" : "justify-start"}`}
//   >
//     {/* <div
//       className={`w-fit p-2 rounded-lg max-w-xs bg-gray-200
//         ${i.role === "ASSISTANT" ? "border border-black" : ""}
//       `}
//     > */}
//       {i.content}

  
//       {i.role === "ASSISTANT" && (
//         <Button className="ml-2" onClick={() => handelClick(i.id)}>
//           preview
//         </Button>
//       )}
//     {/* </div> */}
//   </div>
// ))}
// <div>

//   {dataa[dataa.length-1].role=="USER" && <div className="animate-[fade_3s_ease-in-out_infinite] opacity-10  ">{waitingMessages[index]} </div>}</div> 

//         </div>
//      )
// }
 
// export default Message;