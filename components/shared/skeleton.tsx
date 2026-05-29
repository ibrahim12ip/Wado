import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-white/5", className)}
      {...props}
    />
  );
}

export function ContentCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[2/3] w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[80vh] w-full">
      <Skeleton className="h-full w-full" />
      <div className="absolute bottom-20 left-10 space-y-4">
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-6 w-64" />
        <div className="flex gap-3">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
        </div>
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="relative min-h-screen">
      <Skeleton className="h-[60vh] w-full" />
      <div className="container mx-auto -mt-40 space-y-6 px-4">
        <Skeleton className="h-12 w-96" />
        <Skeleton className="h-6 w-64" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-24 w-full max-w-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <ContentCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Skeleton;
