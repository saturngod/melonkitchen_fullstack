import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: NavItem[];
    isCollapsible?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Category {
    id: string;
    name: string;
    parent_id?: string;
    parent?: Category;
    created_at: string;
    updated_at: string;
}

export interface Tag {
    id: string;
    name: string;
    is_public: boolean;
    created_at: string;
    updated_at: string;
}

export interface Recipe {
    id: string;
    title: string;
    description: string;
    image_url?: string;
    is_public: boolean;
    prep_time_minutes?: number;
    cook_time_minutes?: number;
    servings?: number;
    difficulty?: string;
    categories: Category[];
    tags: Tag[];
    user: User;
    created_at: string;
    updated_at: string;
}
