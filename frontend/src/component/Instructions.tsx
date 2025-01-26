export default function Instructions() {
  

  return (
    <section id="how-to-share" className="max-w-6xl mx-auto rounded-2xl py-12  bg-gradient-to-t from-[#085078] to-[#85D8CE] text-white">
      {/* <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-10">
          How to Share Files
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-white dark:bg-gray-700 rounded-full">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div> */}


      <section>
        <div className="bg-black text-white py-8">
        <div className="container mx-auto flex flex-col items-start md:flex-row my-12 md:my-24">
          <div className="flex flex-col w-full sticky md:top-36 lg:w-1/3 mt-2 md:mt-12 px-8">
            <p className="text-3xl md:text-4xl leading-normal md:leading-relaxed mb-2">How to Share Files Easily</p>
            <p className="text-sm md:text-base text-gray-50 mb-4">
              Follow these simple steps to start sharing files effortlessly:
            </p>
            {/* <a href="#space"
            className="bg-transparent mr-auto hover:bg-[#85D8CE] hover:text-black text-[#85D8CE] rounded shadow hover:shadow-lg py-2 px-4 border border-[#85D8CE] hover:border-transparent">
            Explore Now</a> */}
          </div>
          <div className="ml-0 md:ml-12 lg:w-2/3 sticky">
            <div className="container mx-auto w-full h-full">
              <div className="relative wrap overflow-hidden p-10 h-full">
                <div className="border-2-2 border-[#85D8CE] absolute h-full border"
                  style={{right: "50%" ,border: "1px solid #85D8CE" ,borderRadius: "1%"}}></div>
                <div className="border-2-2 border-[#85D8CE] absolute h-full border"
                  style={{left: "50%", border: "1px solid #85D8CE", borderRadius: "1%"}}></div>
                <div className="mb-8 flex justify-between flex-row-reverse items-center w-full left-timeline">
                  <div className="order-1 w-5/12"></div>
                  <div className="order-1 w-5/12 px-1 py-4 text-right">
                    <h4 className="mb-3 font-bold text-lg md:text-2xl">Create a Space :</h4>
                    <p className="text-sm md:text-base leading-snug text-gray-50 text-opacity-100">
                    Start by setting up your sharing space.
                    </p>
                  </div>
                </div>
                <div className="mb-8 flex justify-between items-center w-full right-timeline">
                  <div className="order-1 w-5/12"></div>
                  <div className="order-1  w-5/12 px-1 py-4 text-left">
                    <h4 className="mb-3 font-bold text-lg md:text-2xl">Connect :</h4>
                    <p className="text-sm md:text-base leading-snug text-gray-50 text-opacity-100">
                    Share via link or scan the QR code.
                    </p>
                  </div>
                </div>
                <div className="mb-8 flex justify-between flex-row-reverse items-center w-full left-timeline">
                  <div className="order-1 w-5/12"></div>
                  <div className="order-1 w-5/12 px-1 py-4 text-right">
                    <h4 className="mb-3 font-bold text-lg md:text-2xl">Give Permission :</h4>
                    <p className="text-sm md:text-base leading-snug text-gray-50 text-opacity-100">
                    Control access with customizable permissions.
                    </p>
                  </div>
                </div>

                <div className="mb-8 flex justify-between items-center w-full right-timeline">
                  <div className="order-1 w-5/12"></div>

                  <div className="order-1  w-5/12 px-1 py-4">
                    <h4 className="mb-3 font-bold  text-lg md:text-2xl text-left">Share Seamlessly :</h4>
                    <p className="text-sm md:text-base leading-snug text-gray-50 text-opacity-100">
                      Transfer files quickly and effortlessly
                    </p>
                  </div>
                </div>
              </div>
              <img className="mx-auto -mt-36 md:-mt-36" src="https://user-images.githubusercontent.com/54521023/116968861-ef21a000-acd2-11eb-95ac-a34b5b490265.png" />
            </div>
          </div>
        </div>
      </div>
      </section>
    </section>
  )
}

