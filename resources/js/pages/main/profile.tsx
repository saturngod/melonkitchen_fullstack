import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { Camera, Eye, EyeOff, User, Mail, Lock, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { SharedData, User as UserType, Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import InputError from '@/components/input-error';
import TopNavigation from '@/components/TopNavigation';

interface ProfilePageProps {
    user: UserType;
    categories: Category[];
}

interface ProfileFormData {
    name: string;
    email: string;
    avatar?: File | null;
    [key: string]: any;
}

interface PasswordFormData {
    current_password: string;
    password: string;
    password_confirmation: string;
    [key: string]: any;
}

export default function Profile({ user, categories }: ProfilePageProps) {
    const { auth } = usePage<SharedData>().props;
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Profile form
    const {
        data: profileData,
        setData: setProfileData,
        post: postProfile,
        processing: profileProcessing,
        errors: profileErrors,
        reset: resetProfile,
    } = useForm<ProfileFormData>({
        name: user.name,
        email: user.email,
    });

    // Password form
    const {
        data: passwordData,
        setData: setPasswordData,
        post: postPassword,
        processing: passwordProcessing,
        errors: passwordErrors,
        reset: resetPassword,
    } = useForm<PasswordFormData>({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleAvatarSelect = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileData('avatar', file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileSubmit = (e: FormEvent) => {
        e.preventDefault();

        postProfile(route('profile.update'), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Profile updated successfully!');
                setAvatarPreview(null);
                resetProfile('avatar');
            },
            onError: () => {
                toast.error('Failed to update profile. Please check your inputs.');
            },
        });
    };

    const handlePasswordSubmit = (e: FormEvent) => {
        e.preventDefault();

        postPassword(route('profile.password.update'), {
            onSuccess: () => {
                toast.success('Password updated successfully!');
                resetPassword();
            },
            onError: () => {
                toast.error('Failed to update password. Please check your inputs.');
            },
        });
    };

    const handleDeleteAvatar = () => {
        router.delete(route('profile.avatar.delete'), {
            onSuccess: () => {
                toast.success('Avatar removed successfully!');
                setAvatarPreview(null);
            },
            onError: () => {
                toast.error('Failed to remove avatar.');
            },
        });
    };

    const getAvatarUrl = () => {
        if (avatarPreview) return avatarPreview;
        if (user.avatar_url) return `/storage/${user.avatar_url as string}`;
        return null;
    };

    return (
        <>
            <Head title="Profile - MelonKitchen" />

            {/* Top Navigation */}
            <TopNavigation categories={categories} />

            {/* Main Content */}
            <div className="min-h-screen bg-background">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Profile <span className="text-blue-600">Settings</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Manage your account information and preferences
                        </p>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Profile Information Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Profile Information
                                </CardTitle>
                                <CardDescription>
                                    Update your personal information and avatar
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleProfileSubmit} className="space-y-6">
                                    {/* Avatar Section */}
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
                                                {getAvatarUrl() ? (
                                                    <img
                                                        src={getAvatarUrl()!}
                                                        alt="Avatar"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <User className="h-10 w-10 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                className="absolute -bottom-2 -right-2 rounded-full p-2"
                                                onClick={handleAvatarSelect}
                                            >
                                                <Camera className="h-3 w-3" />
                                            </Button>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={handleAvatarSelect}
                                            >
                                                Change Avatar
                                            </Button>
                                            {(user.avatar_url as string) && (
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={handleDeleteAvatar}
                                                >
                                                    <Trash2 className="h-3 w-3 mr-1" />
                                                    Remove
                                                </Button>
                                            )}
                                        </div>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />
                                        <InputError message={profileErrors.avatar} />
                                    </div>

                                    <Separator />

                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData('name', e.target.value)}
                                            placeholder="Enter your full name"
                                            className="w-full"
                                        />
                                        <InputError message={profileErrors.name} />
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData('email', e.target.value)}
                                                placeholder="Enter your email address"
                                                className="pl-10 w-full"
                                            />
                                        </div>
                                        <InputError message={profileErrors.email} />
                                    </div>

                                    <Button type="submit" disabled={profileProcessing} className="w-full">
                                        {profileProcessing ? 'Updating...' : 'Update Profile'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Password Change Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lock className="h-5 w-5" />
                                    Change Password
                                </CardTitle>
                                <CardDescription>
                                    Update your password to keep your account secure
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                    {/* Current Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="current_password">Current Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="current_password"
                                                type={showCurrentPassword ? 'text' : 'password'}
                                                value={passwordData.current_password}
                                                onChange={(e) => setPasswordData('current_password', e.target.value)}
                                                placeholder="Enter current password"
                                                className="pr-10 w-full"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            >
                                                {showCurrentPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        <InputError message={passwordErrors.current_password} />
                                    </div>

                                    {/* New Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password">New Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showNewPassword ? 'text' : 'password'}
                                                value={passwordData.password}
                                                onChange={(e) => setPasswordData('password', e.target.value)}
                                                placeholder="Enter new password"
                                                className="pr-10 w-full"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                            >
                                                {showNewPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        <InputError message={passwordErrors.password} />
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="password_confirmation"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={passwordData.password_confirmation}
                                                onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                                placeholder="Confirm new password"
                                                className="pr-10 w-full"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        <InputError message={passwordErrors.password_confirmation} />
                                    </div>

                                    <Button type="submit" disabled={passwordProcessing} className="w-full">
                                        {passwordProcessing ? 'Updating...' : 'Update Password'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Account Information */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Account Information</CardTitle>
                            <CardDescription>
                                View your account details and status
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">User ID</Label>
                                    <p className="text-sm font-mono text-gray-900 break-all">{user.id}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Role</Label>
                                    <p className="text-sm text-gray-900 capitalize">{String(user.role || '').toLowerCase()}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Account Status</Label>
                                    <p className="text-sm text-gray-900">
                                        {user.is_active ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                Inactive
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Email Verified</Label>
                                    <p className="text-sm text-gray-900">
                                        {user.email_verified_at ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Unverified
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
