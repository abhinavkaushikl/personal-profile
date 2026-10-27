import SmoothScroll from '@/components/SmoothScroll';
import Backdrop from '@/components/Backdrop';
import Nav from '@/components/Nav';
import Hud from '@/components/Hud';
import Hero from '@/components/Hero';
import BrandBar from '@/components/BrandBar';
import About from '@/components/About';
import FlightLog from '@/components/FlightLog';
import Payload from '@/components/Payload';
import Pipeline from '@/components/Pipeline';
import Systems from '@/components/Systems';
import Academy from '@/components/Academy';
import Console from '@/components/Console';
import Transmission from '@/components/Transmission';

export default function Page() {
  return (
    <SmoothScroll>
      <Backdrop />
      <Nav />
      <Hud />
      <main>
        <Hero />
        <BrandBar />
        <About />
        <Academy />
        <FlightLog />
        <Payload />
        <Pipeline />
        <Systems />
        <Console />
      </main>
      <Transmission />
    </SmoothScroll>
  );
}
