import { useEffect, useRef, useState } from "react"

interface props {
    generatedURl : string
}

function ShareFile({generatedURl}:props) {
  const fileMetaRef = useRef(null)
  const [socket,setSocket] = useState<null | WebSocket>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [filedata, setfiledata] = useState<null | object>(null)
  const [space,setSpace] = useState("")

  useEffect(()=>{
    const u1 = 'space'+Math.floor(Math.random() * 1000)
    const newSocket = new WebSocket(`ws://localhost:8080?spaceId=${generatedURl}`)

    newSocket.onopen = ()=>{
      
      setSpace(u1)
      const metadata = JSON.stringify({ 
        type : 'register',
        spaceId : u1  })
      newSocket.send(metadata)
      console.log("connected...")
      setSocket(newSocket)
    }

    newSocket.binaryType = 'arraybuffer'
    newSocket.onmessage = (message)=>{
      if(typeof message.data === "string"){
        const metadata = JSON.parse(message.data)
        console.log(metadata)
        fileMetaRef.current = metadata;
      }
      else if(message.data instanceof ArrayBuffer){
        const filedata = fileMetaRef.current
        console.log(filedata)
        if(filedata){
          handleFileDownload(message.data,filedata)
          fileMetaRef.current = null;
        }else{
          console.error("received binary data without metadata")
        }
      }
    }

    return () => {
      newSocket.close();
  };
  },[])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileDownload = (arraybuffer:any, filedata:any)=>{
    const {fileName, fileType} = filedata
    const blob = new Blob([arraybuffer],{
      type : fileType
    })

    const url = URL.createObjectURL(blob)
    const a  = document.createElement("a")
    console.log(url)
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileChange = (event:React.ChangeEvent<HTMLInputElement>)=>{
      if (event.target.files && event.target.files.length > 0) {
        setSelectedFile(event.target.files[0])
    } else {
        setSelectedFile(null)
    }
    // console.log(e.target.files[0])
  }

  const sendFileHandler = ()=>{
    if(!selectedFile)
      return

    // console.log(selectedFile)
    console.log(space)
    const metadata = JSON.stringify({ 
      fileName : selectedFile.name,
      fileType : selectedFile.type });
    // console.log(metadata)
    socket?.send(JSON.stringify({ type: 'message', spaceId: space, metadata }));
    // socket?.send(metadata)
    // socket?.send(selectedFile)
  }

  return (
    <>
    
      <input type="file" onChange={handleFileChange} />
      <button onClick={sendFileHandler}>send</button>
      {space}
    </>
  )
}

export default ShareFile
