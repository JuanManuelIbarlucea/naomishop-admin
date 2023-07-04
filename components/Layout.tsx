import Nav from "@/components/Nav"
import { useSession, signIn } from "next-auth/react"
import { ReactNode } from "react"

interface LayoutProps {
    children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const { data: session } = useSession()

    if (!session) {
        return (<div className={'bg-blue-900 w-screen h-screen flex items-center'}>
            <div className="text-center w-full">
                <button className={"bg-black p-2 px-4 rounded-lg"} onClick={() => signIn('google')}>Login with Google</button>
            </div>
        </div>)
    }

    return (
        <div className="bg-blue-900 min-h-screen flex">
            <Nav />
            <div className="bg-black flex-grow mt-2 mr-2 mb-2 rounded-lg p-4">
                {children}
            </div>
        </div>
    )
}

