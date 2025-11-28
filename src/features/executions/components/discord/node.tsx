"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { BaseExecutionNode } from "../base-execution-node"
import { memo, useState } from "react";
import { DiscordDialog, DiscordFormValues } from "./dialog";
import { useNodeStatus } from "../../hooks/use-node-status";
import { DISCORD_CHANNEL_NAME } from "@/inngest/channels/discord";
import { fetchDiscordRealtimeToken } from "./actions";

type DiscordNodeData = {
    webhookUrl?: string;
    content?: string;
    username?: string;
}

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const {setNodes} = useReactFlow()

    const nodeData = props.data
    const description = nodeData?.content 
    ? `Send: ${nodeData.content.slice(0,50)}...`
    : "Not configured";

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: DISCORD_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchDiscordRealtimeToken
    })

    const handleSubmit = (values: DiscordFormValues) => {
        setNodes(nodes => nodes.map(node => {
            if(node.id === props.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        ...values,
                    }
                }
            }
            return node;
        }))
    }

    const handleOpenSettings = () => setDialogOpen(true);

    return ( 
        <>
            <DiscordDialog onSubmit={handleSubmit} defaultValues={nodeData} open={dialogOpen} onOpenChange={setDialogOpen}/>
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={'/discord.svg'}
                name="Discord"
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
                status={nodeStatus}
            />
        </>
    )
});

DiscordNode.displayName = "DiscordNode"
