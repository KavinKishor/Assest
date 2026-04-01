import Container from "@/components/container";
import { TopNav } from "@/components/nav";

export default function SoftwaresLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <TopNav title="Softwares" />
            <main>
                <Container>{children}</Container>
            </main>
        </>
    );
}
