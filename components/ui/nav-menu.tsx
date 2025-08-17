import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,

} from "@/components/ui/navigation-menu"
import Link from "next/link";
const Nav = () => {
    return ( 
    <NavigationMenu className="absolute p-1 px-2 top-10 rounded-md bg-black/40 text-white z-[10]  text-xl cursor-pointer">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild> 
            <Link href='/zeb'>Home</Link>
             </NavigationMenuLink>
           </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild> 
            <Link href='/zeb'>Features</Link>
             </NavigationMenuLink>
           </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild> 
            <Link href='/zeb'>Suggestions</Link>
             </NavigationMenuLink>
           </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild> 
            <Link href='/zeb'>Join</Link>
             </NavigationMenuLink>
           </NavigationMenuItem>
      
         </NavigationMenuList>
         </NavigationMenu>

     );
}
 
export default Nav;