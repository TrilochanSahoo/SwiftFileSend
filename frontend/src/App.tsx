import Hero from "./component/HeroComponent";
import Instructions from "./component/Instructions";
import ShareFile from "./component/ShareFile"

function App() {
  const currentUrl = window.location.href;
  let  generateLink
  console.log(currentUrl); 
  let spaceID :string = ""
  if(currentUrl.includes("space")){
    spaceID = currentUrl.split('/').pop() || ""
  }
  else{
    spaceID = 'space'+Math.floor(Math.random() * 1000)
    generateLink = window.location.href+spaceID
    console.log(generateLink)
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
        <ShareFile generatedURl = {spaceID}></ShareFile>
      </section>
      {generateLink? generateLink:""}
    </>

    
  )
}

export default App
