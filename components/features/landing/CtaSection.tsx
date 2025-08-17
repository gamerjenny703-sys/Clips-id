import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CtaSection() {
  return (
    <section className="bg-pink-500 py-20">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="text-5xl md:text-7xl font-black uppercase mb-8 text-white">
          READY TO GO
          <br />
          <span className="text-black">BRUTAL?</span>
        </h2>
        <p className="text-xl font-bold mb-12 text-white max-w-2xl mx-auto">
          JOIN THE REVOLUTION. GET A WEBSITE THAT DOESN'T JUST EXIST - IT
          DOMINATES.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
          <Input
            placeholder="YOUR EMAIL ADDRESS"
            className="border-4 border-black bg-white text-black placeholder:text-gray-600 font-bold uppercase text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          />
          <Button className="bg-black text-white border-4 border-black hover:bg-white hover:text-black font-black uppercase px-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap">
            LET'S GO!
          </Button>
        </div>
      </div>
    </section>
  );
}
