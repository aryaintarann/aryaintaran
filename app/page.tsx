import PortfolioPage from "@/app/PortfolioPage";

export const revalidate = 300;

export default async function Home() {
  return <PortfolioPage initialLanguage="id" initialMenu="home" />;
}
