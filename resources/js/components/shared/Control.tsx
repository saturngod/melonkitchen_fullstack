import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ControlProps {
    searchValue: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    actionText: string;
    actionEvent: () => void;
}

export default function Control({
    searchValue,
    onSearchChange,
    actionText,
    actionEvent,
}: ControlProps) {
    return (
        <div className="flex items-center mb-4">
            <Input
                placeholder="Search"
                value={searchValue}
                onChange={onSearchChange}
                className="w-1/3"
            />
            <div className="flex-1" />
            <Button onClick={actionEvent}>{actionText}</Button>
        </div>
    );
}
