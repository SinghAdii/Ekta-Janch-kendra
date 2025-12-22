import { Herosection, Navbar } from "@/components/custom/pages/pages.components.js";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section>
            <Navbar />
            {children}
        </section>
    );
}
