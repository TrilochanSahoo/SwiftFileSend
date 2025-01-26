import { RefObject } from "react";

type ResultsListProps = {
    programInputRef: RefObject<(HTMLDivElement | null)[]>;
  };
  
export default function Hero({programInputRef}:ResultsListProps) {

    const scrollToSection = (index:number)=>{
        const section = programInputRef.current ? programInputRef.current[index]:"";
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    }
    return (
        <section className=" relative bg-white dark:bg-gray-900 min-h-screen overflow-hidden">
            <div className="absolute"
            style={{
                width: "105%",
                height: "60%",
                left: "-3%",
                backgroundImage: "linear-gradient(#085078, #85D8CE)",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                borderBottomLeftRadius: "50% 20%",
                borderBottomRightRadius: "50% 20%"
            }}></div>
            <div className="relative grid max-w-screen-xl h-full px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-24 lg:grid-cols-12">
                <div className="relative top-1/3 mr-auto place-self-center lg:col-span-7">
                    <h1 className="max-w-2xl mb-10 text-4xl font-extrabold tracking-tight leading-none md:text-6xl dark:text-white">
                        Swiftly File Share.</h1>
                    <p className="max-w-lg mb-6 text-gray-500 lg:mb-8 dark:text-white">
                        Effortlessly share files in real-time with secure, fast, and reliable cross-platform compatibility, ensuring seamless collaboration and synchronization anytime.</p>
                    <div className="mt-48">
                        <button onClick={()=> scrollToSection(0)} className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                            Get started
                        </button>
                        <button onClick={()=> scrollToSection(1)} className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                            Learn More
                        </button> 
                    </div>
                </div>
                <div className="relative top-1/2 hidden lg:mt-0 lg:col-span-5 lg:flex">
                    <img src="https://nmx-it.co.uk/wp-content/uploads/2021/08/masthead-img-microsoft-365-r1.svg" alt="mockup"/>
                </div>                
            </div>
        </section>
    )
}