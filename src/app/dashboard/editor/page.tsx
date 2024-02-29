'use client'

import { Suspense } from "react";
import PathReader from "./path-reader";

// import { useRouter } from "next/navigation";
// import { useParams } from 'next/navigation'
// import { useSearchParams } from 'next/navigation'
function PathReaderFallback() {
    return (
        <div>
            <h2>Path Reader</h2>
            <p>Search: nothings</p>
        </div>
    );
}
export default function EditorPage(): JSX.Element {
    // const params = useParams<{ path: string; filetype: string }>();
    // const router = useRouter();
    // console.log(router)
    // const searchParams = useSearchParams()
    // const search = searchParams.get('path')
    return (
        <div>
            <h2>Editor</h2>
            {/* <p>{params.path}</p>
            <p>{params.filetype}</p> */}
            {/* <p>Search: {search}</p> */}
            <Suspense fallback={<PathReaderFallback />}>
                <PathReader />
            </Suspense>
        </div>
    );
}