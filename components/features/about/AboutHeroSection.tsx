export default function AboutHeroSection() {
  return (
    <section className="bg-black text-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-6xl md:text-8xl font-black uppercase leading-none mb-8">
              WE ARE
              <br />
              <span className="text-yellow-400">BRUTAL</span>
            </h1>
            <p className="text-xl font-bold mb-8">
              WE'RE NOT YOUR TYPICAL DESIGN AGENCY. WE'RE REBELS, MISFITS, AND
              DIGITAL REVOLUTIONARIES WHO BELIEVE THE WEB SHOULD BE BOLD, NOT
              BORING.
            </p>
          </div>
          <div className="relative">
            <div className="bg-yellow-400 border-4 border-white p-8 shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] transform -rotate-2">
              <div className="text-6xl font-black mb-4">2019</div>
              <div className="font-bold uppercase">
                FOUNDED WITH A MISSION TO KILL BORING DESIGN
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
