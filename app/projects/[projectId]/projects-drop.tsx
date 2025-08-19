"use client"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ProjectsDropDownMenu = ({projects}) => {
    return ( 

        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-center ">
                Projects <ArrowDown/>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
        {projects.map((p)=><DropdownMenuItem> {p.name}</DropdownMenuItem>

        )}
            </DropdownMenuContent>

        </DropdownMenu>

);
}
 
export default ProjectsDropDownMenu;