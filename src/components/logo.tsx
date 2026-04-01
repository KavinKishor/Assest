import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";


export function Logo({ className }: { className?: string }) {
    return (
        <Link href="/" className={cn("flex items-center gap-2 group transition-all", className)}>
            <Image src={'/acidus.png'} alt="Acidus Logo" width={100} height={100} className="brightness-5 " />
        </Link>
    );
}
