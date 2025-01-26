import { useEffect, useState } from "react";
import Hero from "./component/HeroComponent";
import Instructions from "./component/Instructions";
import ShareFile from "./component/ShareFile"
import ReceiveFile from "./component/ReceiveFile";
import Footer from "./component/Footer";

function App() {
  const [activeShare, setActiveShare] = useState(false)
  const [activeReceive, setActiveReceive] = useState(false)
  const [spaceId, setSpaceId] = useState("")
  const [generatedLink,setGeneratedLink] = useState("")

  let spaceID :string = ""
  const currentUrl = window.location.href;

  useEffect(() => {
    const path = new URL(currentUrl).pathname
    if(path != "/")
    {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      if(validate(atob(path.slice(1)))){
        setSpaceId(atob(path.slice(1)))
        setActiveReceive(true)
      }
      else
        alert("Invalid URL!")
    }
  }, [currentUrl]); 

  const validate = (data:string)=>{
    const regex = /^space\d{1,4}$/;
    return regex.test(data);
  }

  const createSpaceHandler = ()=>{
    spaceID = 'space'+Math.floor(Math.random() * 1000)
    setSpaceId(spaceID)
    setGeneratedLink(window.location.href+ btoa(spaceID))
    console.log(generatedLink)
    setActiveShare(true)
  }

  return (
    <>
      <section>
        <Hero/>
      </section>
      <section className="bg-gray-900 py-12">
        <Instructions/>
      </section>
      <section id="space" className="py-12 bg-gradient-to-t from-[#085078] to-[#85D8CE] text-white">
      {!activeReceive &&
        
          <div className="max-w-6xl mx-auto text-white items-center text-center">
            <h2 className="text-3xl md:text-5xl leading-normal font-semibold md:leading-relaxed mb-2 lg:mb-8">Start Sharing Files</h2>
            <button className="bg-transparent mr-auto hover:bg-white text-white hover:text-black rounded shadow hover:shadow-lg py-2 px-4 border border-white hover:border-transparent" onClick={createSpaceHandler}> Create Space</button>
          </div>
      }
      {activeReceive && 
      <div className="max-w-xl mx-auto text-white items-center text-center">
        <ReceiveFile generatedURl = {spaceId}></ReceiveFile>
      </div>
      }
      {activeShare && 
        <div className="max-w-6xl mx-auto text-white items-center text-center">
          <ShareFile generatedURl = {spaceId} generatedLink = {generatedLink}></ShareFile>
        </div>
      }
      </section>
      <section className="relative bottom-0 bg-gray-900">
        <Footer/>
      </section>
    </>
  )
}

export default App
