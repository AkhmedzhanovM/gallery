import Gallery from "@/components/Gallery";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <main className="bg-black h-screen w-screen">
      <Nav />
      <h1 className="text-white text-4xl flex items-center justify-center pt-40">Favorites</h1>
      <Gallery favorites={true} />
    </main>
  );
}
