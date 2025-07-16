import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function RecipeCardSkeleton() {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="p-0">
                <Skeleton className="aspect-video rounded-t-lg" />
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col">
                <div className="flex-1">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3 mb-3" />
                    <Skeleton className="h-4 w-1/2 mb-3" />
                </div>

                <div className="mt-auto space-y-3">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-5 w-10" />
                    </div>
                    <div className="flex gap-1">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 w-16" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}