import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function RecipeShowSkeleton() {
    return (
        <div className="max-w-7xl mx-auto">
            {/* Header Skeleton */}
            <div className="mb-8">
                <Skeleton className="h-8 w-3/4 mb-6" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Image skeleton */}
                    <div>
                        <Skeleton className="aspect-video w-full rounded-lg mb-4" />
                    </div>

                    {/* Info skeleton */}
                    <div className="space-y-6">
                        <div>
                            <Skeleton className="h-6 w-24 mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>

                        <div>
                            <Skeleton className="h-6 w-32 mb-3" />
                            <div className="grid grid-cols-2 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="p-3 bg-muted/30 rounded-lg">
                                        <Skeleton className="h-4 w-16 mb-1" />
                                        <Skeleton className="h-6 w-12" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content sections skeleton */}
            <div className="space-y-8">
                {/* Metadata section */}
                <div>
                    <Skeleton className="h-6 w-48 mb-4" />
                    <div className="space-y-4">
                        <div>
                            <Skeleton className="h-5 w-24 mb-2" />
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                        </div>
                        <div>
                            <Skeleton className="h-5 w-16 mb-2" />
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-6 w-18" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ingredients section */}
                <div>
                    <Skeleton className="h-6 w-32 mb-4" />
                    <div className="space-y-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-lg border">
                                <Skeleton className="w-4 h-4 mt-1" />
                                <div className="flex-1">
                                    <Skeleton className="h-4 w-3/4 mb-1" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Instructions section */}
                <div>
                    <Skeleton className="h-6 w-32 mb-4" />
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <Card key={i}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-start gap-3">
                                        <Skeleton className="w-6 h-6 rounded-full" />
                                        <Skeleton className="h-5 w-20" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-4/5 mb-2" />
                                    <Skeleton className="h-4 w-3/5" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Nutrition section */}
                <div>
                    <Skeleton className="h-6 w-48 mb-4" />
                    <div className="max-w-md mx-auto">
                        <Card>
                            <CardHeader className="text-center pb-2">
                                <Skeleton className="h-6 w-32 mx-auto mb-2" />
                                <Skeleton className="h-4 w-24 mx-auto" />
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-5 w-12" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Actions section */}
                <div>
                    <Skeleton className="h-6 w-20 mb-4" />
                    <div className="space-y-4">
                        <div>
                            <Skeleton className="h-5 w-24 mb-2" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                        <div>
                            <Skeleton className="h-5 w-32 mb-2" />
                            <div className="flex gap-3">
                                <Skeleton className="h-10 w-24" />
                                <Skeleton className="h-10 w-28" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}