'use client'
import React from 'react'
import { Darkmode } from './buttons/Darkmode'
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
import { Button } from "@/components/ui/button";


function Header({ tabs, setTable }) {
    return (
        <div className="flex w-full max-w-[1600px] m-auto justify-between p-5">
            {tabs &&
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem >
                            <Button variant="link" onClick={() => setTable("position")}>
                                Positions
                            </Button>
                        </NavigationMenuItem>
                        <NavigationMenuItem >
                            <Button variant="link" onClick={() => setTable("candidate")}>
                                Candidates
                            </Button>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            }
            <Darkmode />
        </div>
    )
}

export default Header