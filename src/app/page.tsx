"use client"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { requireAuth } from "@/lib/auth-utils"
import { caller } from "@/trpc/server"
import { LogoutBtn } from "./logout"
import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const Page = () => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const {data} = useQuery(trpc.getWorkflows.queryOptions())
  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.getWorkflows.queryOptions())
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
     <LogoutBtn/>
    </div>
  )
}

export default Page