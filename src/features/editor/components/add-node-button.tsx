"use client"

import { NodeSelector } from "@/components/node-selector"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { memo, useState } from "react"

export const AddNodeButton = memo(() => {
    const [selectorOpen, setSelectorOpen] = useState(false);

    return (
        <NodeSelector onOpenChange={setSelectorOpen} open={selectorOpen}>
            <Button onClick={() => { }} size={'icon'} variant={'outline'} className="bg-background">
                <PlusIcon />
            </Button>
        </NodeSelector>
    )
})

AddNodeButton.displayName = "AddNodeButton"