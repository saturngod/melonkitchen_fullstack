import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-12 items-center justify-center rounded-md text-sidebar-primary-foreground">
                <AppLogoIcon className="size-12 fill-current " />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm mt-4">
                <span className="mb-0.5 truncate leading-tight font-semibold">MelonKitchen</span>
            </div>
        </>
    );
}
