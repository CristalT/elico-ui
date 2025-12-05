import { Rubik } from 'next/font/google';

const rubik = Rubik({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
});

export default function Heading({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={`${rubik.className} ${className}`}>{children}</div>;
}
