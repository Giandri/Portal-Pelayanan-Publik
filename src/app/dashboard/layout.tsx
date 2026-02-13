import Image from "next/image";
import { Sidebar } from "../../components/dashboard/sidebar";
import { Toaster } from "sonner";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background - Blueprint style */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 " />
                <Image
                    src="/images/bg-1.png"
                    alt=""
                    fill
                    className="object-cover opacity-[0.4] mix-blend-multiply object-top"
                    priority
                />
                <Image
                    src="/images/bg-2.png"
                    alt=""
                    fill
                    className="object-cover opacity-[0.6] mix-blend-multiply object-bottom"
                />
                {/* Subtle grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(250,204,21,0.4) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(250,204,21,0.4) 1px, transparent 1px)
                        `,
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            {/* Top Header Bar */}
            <header className="fixed top-0 left-0 right-0 z-30 h-[72px]">
                <div className="h-full flex items-center gap-4 px-6">
                    <Image
                        src="/images/logo PU.png"
                        alt="Logo PU"
                        width={48}
                        height={48}
                        className="flex-shrink-0"
                    />
                    <div>
                        <h1 className="text-lg font-extrabold text-blue-950 tracking-wide leading-tight">
                            DASHBOARD
                        </h1>
                        <p className="text-sm font-bold text-blue-950/70 tracking-wider leading-tight -mt-0.5">
                            LAYANAN PUBLIK
                        </p>
                    </div>
                </div>
            </header>

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="relative z-10 pt-[88px] pb-4 pr-4 pl-[112px] min-h-screen lg:pl-[112px]">
                <div className="relative h-full min-h-[calc(100vh-104px)] rounded-[24px] border border-yellow-200/70 bg-white/60 backdrop-blur-sm shadow-xl overflow-hidden">


                    {/* Page content */}
                    <div className="relative z-10 p-6 lg:p-8">
                        {children}
                    </div>
                </div>
            </main>
            <Toaster position="top-center" richColors />
        </div>
    );
}
