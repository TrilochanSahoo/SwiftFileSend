import ShareFile from "./component/ShareFile"

function App() {
  const currentUrl = window.location.href;
  console.log(currentUrl); 
  let spaceID :string = ""
  if(currentUrl.includes("space")){
    spaceID = currentUrl.split('/').pop() || ""
  }
  else{
    spaceID = 'space'+Math.floor(Math.random() * 1000)
    const generateLink = window.location.href+spaceID
    console.log(generateLink)
  }
  return (
    
    <ShareFile generatedURl = {spaceID}></ShareFile>
    
  )
}

export default App
