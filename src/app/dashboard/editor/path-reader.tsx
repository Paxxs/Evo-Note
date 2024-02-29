'use client'

import { useSearchParams } from "next/navigation"

export default function PathReader(): JSX.Element {
    const searchParams = useSearchParams()
    const search = searchParams.get('path')
    return (
        <div>
            <h2>Path Reader</h2>
            <p>Search: {search}</p>
        </div>
    );
}