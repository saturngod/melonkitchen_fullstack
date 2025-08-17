import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Camera, Mail, Lock, User as UserIcon, Trash2 } from 'lucide-react';
import TopNavigation from '@/components/TopNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Category } from '@/types';

interface ProfileUser {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
    role: string;
    email_verified_at: string | null;
    created_at: string;
}

interface ProfileProps {
    user: ProfileUser;
    categories: Category[];
    [key: string]: any;
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

export default function Profile() {
    const { user, categories } = usePage<ProfileProps>().props;

    const [profileForm, setProfileForm] = useState<ProfileFormData>({
        name: user.name,
        email: user.email,
        avatar: null
    });

    const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
        current_password: '',
        password: '',
        password_confirmation: ''
    });

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
    const [isDeletingAvatar, setIsDeletingAvatar] = useState(false);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileForm({ ...profileForm, avatar: file });

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('name', profileForm.name);
            formData.append('email', profileForm.email);

            if (profileForm.avatar) {
                formData.append('avatar', profileForm.avatar);
            }

            const response = await fetch(route('profile.update'), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result.message);
                setAvatarPreview(null);
                setProfileForm({ ...profileForm, avatar: null });

                // Refresh the page to show updated data
                router.reload();
            } else {
                throw new Error(result.message || 'Failed to update profile');
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPasswordSubmitting(true);

        try {
            const response = await fetch(route('profile.password.update'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(passwordForm),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result.message);
                setPasswordForm({
                    current_password: '',
                    password: '',
                    password_confirmation: ''
                });
            } else {
                throw new Error(result.message || 'Failed to update password');
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to update password');
        } finally {
            setIsPasswordSubmitting(false);
        }
    };

    const handleDeleteAvatar = async () => {
        setIsDeletingAvatar(true);

        try {
            const response = await fetch(route('profile.avatar.delete'), {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result.message);
                router.reload();
            } else {
                throw new Error(result.message || 'Failed to delete avatar');
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to delete avatar');
        } finally {
            setIsDeletingAvatar(false);
        }
    };

    return (
        <>
            <Head title="Profile - MelonKitchen" />

            {/* Top Navigation */}
            <TopNavigation categories={categories} />

            {/* Main Content */}
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
                        <p className="text-gray-600">Manage your account settings and preferences</p>
                    </div>

                    <div className="grid gap-8 max-w-4xl">
                        {/* Avatar Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Camera className="h-5 w-5" />
                                    Profile Picture
                                </CardTitle>
                                <CardDescription>
                                    Upload a profile picture to personalize your account
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                            {avatarPreview || user.avatar_url ? (
                                                <img
                                                    src={avatarPreview || user.avatar_url || ''}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <UserIcon className="h-12 w-12 text-gray-400" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="avatar" className="cursor-pointer">
                                            <Button type="button" variant="outline" className="flex items-center gap-2">
                                                <Camera className="h-4 w-4" />
                                                Choose Photo
                                            </Button>
                                            <input
                                                id="avatar"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                            />
                                        </Label>

                                        {user.avatar_url && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleDeleteAvatar}
                                                disabled={isDeletingAvatar}
                                                className="flex items-center gap-2 text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                {isDeletingAvatar ? 'Deleting...' : 'Remove'}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Profile Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserIcon className="h-5 w-5" />
                                    Profile Information
                                </CardTitle>
                                <CardDescription>
                                    Update your account's profile information and email address
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleProfileSubmit} className="space-y-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={profileForm.name}
                                                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={profileForm.email}
                                                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-600">
                                        <div>
                                            <span className="font-medium">Role:</span> {String(user.role).toUpperCase()}
                                        </div>
                                        <div>
                                            <span className="font-medium">Member since:</span> {new Date(user.created_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        {isSubmitting ? 'Updating...' : 'Update Profile'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Password Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lock className="h-5 w-5" />
                                    Update Password
                                </CardTitle>
                                <CardDescription>
                                    Ensure your account is using a long, random password to stay secure
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current_password">Current Password</Label>
                                        <Input
                                            id="current_password"
                                            type="password"
                                            value={passwordForm.current_password}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">New Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={passwordForm.password}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Confirm Password</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={passwordForm.password_confirmation}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, password_confirmation: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <Button type="submit" disabled={isPasswordSubmitting} className="flex items-center gap-2">
                                        <Lock className="h-4 w-4" />
                                        {isPasswordSubmitting ? 'Updating...' : 'Update Password'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
