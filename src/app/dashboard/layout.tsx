export default function DashboardLayout({
    children,
}: { children: React.ReactNode }): JSX.Element {
    return (
        <div className="flex w-full h-dvh flex-row">
            {children}
        </div>
    );
}