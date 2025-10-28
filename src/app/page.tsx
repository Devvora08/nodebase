"use client"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { requireAuth } from "@/lib/auth-utils"
import { caller } from "@/trpc/server"
import { LogoutBtn } from "./logout"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const Page = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const {data} = useQuery(trpc.getWorkflows.queryOptions())
  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.getWorkflows.queryOptions())
    }
  }))

  const testAI = useMutation(trpc.testAi.mutationOptions({
    onSuccess: () => {
      toast.success("AI job queued")
    }
  }))

  return (
    <div>
     protected server component
     {JSON.stringify(data)}
     <div>
        <Button disabled={create.isPending} onClick={() => create.mutate()}>
          Create a workflow
        </Button>
     </div>
     <div>
        <Button disabled={testAI.isPending} onClick={() => testAI.mutate()}>
          Test AI
        </Button>
     </div>
     <LogoutBtn/>
    </div>
  )
}

export default Page