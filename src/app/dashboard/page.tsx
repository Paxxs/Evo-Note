"use client"

import EvoEditor from "@/components/evo-note/editor"


export default function Page(): JSX.Element {
    return (
        <div className="flex w-full">
            <EvoEditor />
            {/* <h1>Dashboard</h1> */}
        </div>
    );
}