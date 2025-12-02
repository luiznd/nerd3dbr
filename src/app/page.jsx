import Hero from '../components/Hero';
import About from '../components/About';
import Services from '../components/Services';
import Gallery from '../components/Gallery';
import FeaturedProducts from '../components/FeaturedProducts';
import Contact from '../components/Contact';

export const metadata = {
  title: 'Nerd 3D BR',
  description: 'Tecnologia, impressão 3D, conteúdo geek, games e action figures.',
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Services />
      <FeaturedProducts />
      <Gallery />
      <Contact />
    </main>
  );
}
