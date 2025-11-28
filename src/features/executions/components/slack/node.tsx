"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { BaseExecutionNode } from "../base-execution-node"
import { memo, useState } from "react";
import { useNodeStatus } from "../../hooks/use-node-status";
import { SlackDialog, SlackFormValues } from "./dialog";
import { fetchSlackRealtimeToken } from "./actions";
import { SLACK_CHANNEL_NAME } from "@/inngest/channels/slack";

type SlackNodeData = {
    webhookUrl?: string;
    content?: string;
}

type SlackNodeType = Node<SlackNodeData>;

export const SlackNode = memo((props: NodeProps<SlackNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const {setNodes} = useReactFlow()

    const nodeData = props.data
    const description = nodeData?.content 
    ? `Send: ${nodeData.content.slice(0,50)}...`
    : "Not configured";

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: SLACK_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchSlackRealtimeToken
    })

    const handleSubmit = (values: SlackFormValues) => {
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
            <SlackDialog onSubmit={handleSubmit} defaultValues={nodeData} open={dialogOpen} onOpenChange={setDialogOpen}/>
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={'/slack.svg'}
                name="Slack"
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
                status={nodeStatus}
            />
        </>
    )
});

SlackNode.displayName = "SlackNode"
