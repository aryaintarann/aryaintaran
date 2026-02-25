import PortfolioPage from "@/app/PortfolioPage";

// Revalidate data always (dynamic)
export const revalidate = 0;

export default async function Home() {
  return <PortfolioPage initialLanguage="id" initialMenu="home" />;
}
