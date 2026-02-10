import Container from "@/components/container";
import { TopNav } from "@/components/nav";

export default function OfficeAssetsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <TopNav title="Office Assets" />
            <main>
                <Container>{children}</Container>
            </main>
        </>
    );
}
