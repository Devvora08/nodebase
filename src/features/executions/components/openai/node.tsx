"use client"

import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { BaseExecutionNode } from "../base-execution-node"
import { memo, useState } from "react";
import { useNodeStatus } from "../../hooks/use-node-status";
import { OpenAiDialog, OpenAiFormValues } from "./dialog";
import { fetchOpenAiRealtimeToken } from "./actions";
import { OPENAI_CHANNEL_NAME } from "@/inngest/channels/openai";

type OpenAiNodeData = {
    variableName?: string;
    systemPrompt?: string;
    userPrompt?: string;
}

type OpenAiNodeType = Node<OpenAiNodeData>;

export const OpenAiNode = memo((props: NodeProps<OpenAiNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const {setNodes} = useReactFlow()

    const nodeData = props.data
    const description = nodeData?.userPrompt 
    ? `"gpt-4": ${nodeData.userPrompt.slice(0,50)}...`
    : "Not configured";

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: OPENAI_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchOpenAiRealtimeToken
    })

    const handleSubmit = (values: OpenAiFormValues) => {
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
            <OpenAiDialog onSubmit={handleSubmit} defaultValues={nodeData} open={dialogOpen} onOpenChange={setDialogOpen}/>
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={'/openai.svg'}
                name="OpenAI"
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
                status={nodeStatus}
            />
        </>
    )
});

OpenAiNode.displayName = "OpenAiNode"
