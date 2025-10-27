import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { requireAuth } from "@/lib/auth-utils"
import { caller } from "@/trpc/server"
import { LogoutBtn } from "./logout"

const Page = async () => {
  await requireAuth()
  const data = await caller.getUsers();
  return (
    <div>
     protected server component
     {JSON.stringify(data)}
     <LogoutBtn/>
    </div>
  )
}

export default Page