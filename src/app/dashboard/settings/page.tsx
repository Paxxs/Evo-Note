export default function Page({
    params,
    searchParams,
}: {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    console.log(searchParams)
    return (
        <div>
            <h1>My Page</h1>
            {/* <h1>{searchParams['path']}</h1> */}
        </div>
    )
}