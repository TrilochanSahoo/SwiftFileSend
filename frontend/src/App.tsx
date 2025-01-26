import { useEffect, useState } from "react";
import Hero from "./component/HeroComponent";
import Instructions from "./component/Instructions";
import ShareFile from "./component/ShareFile"
import ReceiveFile from "./component/ReceiveFile";

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
      <section>
        <button onClick={createSpaceHandler}> create space</button>
      </section>
      {activeReceive && 
      <div>
        <ReceiveFile generatedURl = {spaceId}></ReceiveFile>
      </div>
      }
      {activeShare && 
        <div>
          <ShareFile generatedURl = {spaceId} generatedLink = {generatedLink}></ShareFile>
          {generatedLink? generatedLink:""}
        </div>
      }
      
    </>
  )
}

export default App
