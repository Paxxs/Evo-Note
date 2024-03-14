import { Skeleton } from "../ui/skeleton";

export default function EvoSkeleton() {
  return (
    <>
      <div className="flex flex-col w-full bg-background">
        <div className="flex flex-row items-center justify-between border-b select-none h-12 space-x-7">
          <Skeleton className="ml-3 h-5 w-60 " />
          <div className="flex flex-row gap-6 justify-center items-center">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-6 mr-3" />
          </div>
        </div>
        <div className="flex h-full items-stretch">
          <div className="flex flex-col w-1/5">
            <div className="h-[52px] px-2 border-b items-center justify-center">
              <Skeleton className="h-10  mt-1" />
            </div>
            <div className="flex flex-grow">
              {/* 侧栏 */}
              <div className="flex flex-col gap-4 py-2 px-2 flex-grow">
                <Skeleton className="h-10  mt-1" />
                <Skeleton className="h-10  mt-1" />
                <Skeleton className="h-10  mt-1" />
                <Skeleton className="h-10  mt-1" />
                <Skeleton className="h-10 mt-auto" />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-[30%]">
            <div className="h-[52px] p-2 border-b border-x">
              <Skeleton className="h-7 w-14 mt-1 ml-3" />
            </div>
            <div className="flex flex-col flex-grow border-x gap-2 p-3">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              {/* 侧栏 */}
            </div>
          </div>
          <div className="flex flex-col flex-grow">
            <div className="h-[52px] px-2 border-b">
              <Skeleton className="h-7 w-20 mt-3 ml-3" />
            </div>
            <div className="flex flex-col flex-grow gap-3 p-3">
              <Skeleton className="h-28" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
              {/* 侧栏 */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
