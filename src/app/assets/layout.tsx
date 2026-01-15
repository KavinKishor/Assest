import Container from "@/components/container";
import { TopNav } from "@/components/nav";

export default function AssetsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <TopNav title="Assets" />
            <main>
                <Container>{children}</Container>
            </main>
        </>
    );
}
