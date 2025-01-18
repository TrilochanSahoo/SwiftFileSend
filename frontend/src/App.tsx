import { useEffect, useState } from "react";
import Hero from "./component/HeroComponent";
import Instructions from "./component/Instructions";
import ShareFile from "./component/ShareFile"
import ReceiveFile from "./component/ReceiveFile";

function App() {
  const [activeShare, setActiveShare] = useState(false)
  const [activeReceive, setActiveReceive] = useState(false)
  const [spaceId, setSpaceId] = useState("")

  let  generateLink
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
    generateLink = window.location.href+ btoa(spaceID)
    console.log(generateLink)
    setActiveShare(true)
  }

  return (
    <>
      <section>
        <Hero/>
      </section>
      <section>
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
          <ShareFile generatedURl = {spaceId}></ShareFile>
          {generateLink? generateLink:""}
        </div>
      }
      
    </>
  )
}

export default App
