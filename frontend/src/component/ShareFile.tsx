import { QrCode } from "lucide-react";
import { useEffect, useRef, useState } from "react"

interface props {
    generatedURl : string
}

function ShareFile({generatedURl}:props) {
  const fileMetaRef = useRef(null)
  const [socket,setSocket] = useState<null | WebSocket>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null)
  // const [filedata, setfiledata] = useState<null | object>(null)
  const [space,setSpace] = useState("")
  const [usersMetadata,setUsersMetadata] = useState([])

  useEffect(()=>{
    const u1 = generatedURl
    const newSocket = new WebSocket(`ws://localhost:8080?spaceId=${generatedURl}`)

    newSocket.onopen = ()=>{
      
      setSpace(u1)
      const metadata = JSON.stringify({ 
        type : 'register',
        role : 'admin',
        access : "true",
        spaceId : u1  })
      newSocket.send(metadata)
      console.log("connected...")
      setSocket(newSocket)
    }

    newSocket.binaryType = 'arraybuffer'
    newSocket.onmessage = (message)=>{
      if(typeof message.data === "string"){
        const metadata = JSON.parse(message.data)
        if("access" in metadata){
          setUsersMetadata(metadata)
        }else{
          fileMetaRef.current = metadata;
        }
        console.log(metadata)
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
    <section id="file-sharing" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Share Your File
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Select a file to share and generate a QR code for easy access.
            </p>
            <div className="space-y-2">
              <input type="file" name="" id="" />
              <button>
              Share File
              </button>
            </div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            {shareLink ? (
              <div className="space-y-4">
                <p className="font-medium">Scan this QR code to access the file:</p>
                <div className="flex justify-center">
                  {/* <QRCode value={shareLink} size={200} /> */}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 break-all">{shareLink}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <QrCode className="w-16 h-16 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400">
                  Share a file to generate a QR code
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
      <input type="file" onChange={handleFileChange} />
      <button onClick={sendFileHandler}>send</button>
      {space}
      {usersMetadata}
    </>
  )
}

export default ShareFile
