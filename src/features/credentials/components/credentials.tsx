"use client"

import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-components";
import { useRemoveCredential, useSuspenseCredentials } from "../hooks/use-credentials"
import { useRouter } from "next/navigation";
import { useCredentialsParams } from "../hooks/use-credentails-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { CredentialType } from "@/generated/prisma"
import type {Credential} from "@/generated/prisma"
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

export const CredentialsSearch = () => {
    const [params, setParams] = useCredentialsParams();
    const { searchValue, onSearchChange } = useEntitySearch({
        params,
        setParams
    })
    return (
        <EntitySearch value={searchValue} onChange={onSearchChange} placeholder={"Search credentials"} />
    )
}

export const CredentialsList = () => {
    const credentials = useSuspenseCredentials();

    return (
        <EntityList items={credentials.data.items} getKey={(credential) => credential.id}
            renderItem={(credential) => <CredentialItem data={credential} />}
            emptyView={<CredentialsEmpty />}
        />
    )
}

export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {
    return (
        <>
            <EntityHeader title="Credentials" description="Create and manage your credentials"
                newButtonLabel="New credential"
                disabled={disabled}
                newButtonHref={"/credentials/new"}
            />
        </>
    )
}

export const CredentialsPagination = () => {
    const credentials = useSuspenseCredentials();
    const [params, setParams] = useCredentialsParams();

    return (
        <EntityPagination
            disabled={credentials.isFetching}
            totalPages={credentials.data.totalPages}
            page={credentials.data.page}
            onPageChange={(page) => setParams({ ...params, page })}
        />
    )
}

export const CredentialsContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <EntityContainer
            header={<CredentialsHeader />}
            search={<CredentialsSearch />}
            pagination={<CredentialsPagination />}
        >
            {children}
        </EntityContainer>
    )
}

export const CredentialsLoading = () => {
    return <LoadingView entity="credentials" />
}

export const CredentialsError = () => {
    return <ErrorView message="Error loading credentials" />
}

export const CredentialsEmpty = () => {
    const router = useRouter()

    const handleCreate = () => {
        router.push(`/credentials/new`)
    }

    return (
        <>
            <EmptyView onNew={handleCreate} message="No credentails found or created. Get started" />
        </>
    )
}

const credentialLogos: Record<CredentialType, string> = {
    [CredentialType.OPENAI]: "/openai.svg",
    [CredentialType.ANTHROPIC]: "/anthropic.svg",
    [CredentialType.GEMINI]: "/gemini.svg",
}

export const CredentialItem = ({ data }: { data: Credential }) => {
    const removeCredential = useRemoveCredential();

    const handleRemove = () => {
        removeCredential.mutate({ id: data.id })
    }
    const logo = credentialLogos[data.type] || "/openai.svg";
    return (
        <EntityItem
            href={`/credentials/${data.id}`}
            title={data.name}
            subtitle={
                <>
                    Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
                    &bull; Created{" "}
                    {formatDistanceToNow(data.createdAt, { addSuffix: true })}
                </>
            }
            image={
                <div className="size-8 flex items-center justify-center">
                    <Image src={logo} alt={data.type} width={20} height={20}/>
                </div>
            }
            onRemove={handleRemove}
            isRemoving={removeCredential.isPending}
        />
    )
}