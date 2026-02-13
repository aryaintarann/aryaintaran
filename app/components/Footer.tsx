export default function Footer() {
    return (
        <footer className="bg-background border-t border-white/5 py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-secondary text-sm">
                    &copy; {new Date().getFullYear()} Arya Ngurah Intaran.
                </p>
            </div>
        </footer>
    );
}
