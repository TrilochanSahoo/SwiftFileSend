import axios from "axios";
import { Check, QrCode, X } from "lucide-react";
import { useEffect, useRef, useState } from "react"

interface props {
    generatedURl : string,
    generatedLink : string | null
}

interface metadata {
  access : boolean,
  user : string
}

function ShareFile({generatedURl,generatedLink}:props) {
  const fileMetaRef = useRef(null)
  const [socket,setSocket] = useState<null | WebSocket>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null)
  const [qrCodeData, setQrCodeData] = useState<string>("")
  const [space,setSpace] = useState("")
  const [usersMetadata,setUsersMetadata] = useState<metadata[]>([])

  useEffect(()=>{
    const u1 = generatedURl
    console.log(generatedLink)
    setShareLink(generatedLink)
    const newSocket = new WebSocket(`${import.meta.env.VITE_BACKEND_URL_ws}?spaceId=${generatedURl}`)

    newSocket.onopen = ()=>{
      
      setSpace(u1)
      const metadata = JSON.stringify({ 
        type : 'register',
        role : 'admin',
        access : "true",
        spaceId : u1,
        userId : "1000"  })
      newSocket.send(metadata)
      console.log("connected...")
      setSocket(newSocket)
    }

    newSocket.binaryType = 'arraybuffer'
    newSocket.onmessage = (message)=>{
      if(typeof message.data === "string"){
        const metadata = JSON.parse(message.data)
        if("access" in metadata){
          setUsersMetadata((prevUsers) => {
              return [...prevUsers, metadata]
          });
        }
        else{
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

  useEffect(()=>{
    const url:string = `${import.meta.env.VITE_BACKEND_URL}/api/v1/generateQrcode`
    const fetchqrDate= async()=>{
      const res = await axios({
        method:"post",
        url:url,
        data:{
          content : generatedLink
        }
      })

      if(res.status==200){
        setQrCodeData(res.data.src)
      }
      else{
        alert("Please create again the space...")
      }
    }

    fetchqrDate()

  },[generatedLink])

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
    // console.log(event.target.files[0])
  }

  const sendFileHandler = ()=>{
    if(!selectedFile)
      return

    // console.log(selectedFile)
    console.log(space)
    const metadata = JSON.stringify({ 
      fileName : selectedFile.name,
      fileType : selectedFile.type });
    console.log(selectedFile)
    socket?.send(JSON.stringify({ type: 'message', spaceId: space, metadata: metadata }));
    socket?.send(selectedFile)

  }

  console.log(usersMetadata)

  const allowPermission = (userMetadata:metadata) => {
    const metadata = JSON.stringify({ 
      type : 'register',
      role : 'user',
      access : "true",
      spaceId : space,
      userId : userMetadata.user
    })
    socket?.send(metadata)
    setUsersMetadata(usersMetadata.filter(item => item.user !== userMetadata.user))
  }

  const removePermission = (userMetadata:metadata) => {
    const metadata = JSON.stringify({ 
      type : 'remove',
      role : 'user',
      access : "false",
      spaceId : space,
      userId : userMetadata.user
    })
    socket?.send(metadata)
    setUsersMetadata(usersMetadata.filter(item => item.user !== userMetadata.user))
  }

  return (
    <>
      <section id="file-sharing" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              
              <div className="space-y-2">
              <input className=" w-full text-gray-400 font-semibold text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-3 file:px-4 file:mr-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-gray-500 rounded" type="file" multiple onChange={handleFileChange} placeholder="Upload your files" />
              <button className="bg-transparent mr-auto hover:bg-white text-white hover:text-black rounded shadow hover:shadow-lg py-2 px-4 border border-white hover:border-transparent" onClick={sendFileHandler}>Send File</button>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
              {shareLink ? (
                <div className="space-y-4">
                  <p className="font-medium">Scan this QR code to access to the shared Link :</p>
                  <div className="flex justify-center">
                    <img src={qrCodeData} alt="" className="h-24 w-24" />
                  </div>

                  <div className="flex items-center">
                    <span className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg dark:bg-gray-600 dark:text-white dark:border-gray-600">URL</span>
                    <div className="relative w-full">
                        <input id="website-url" type="text" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-e-0 border-gray-300 text-gray-500 dark:text-gray-400 text-sm border-s-0 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" value={shareLink} disabled />
                    </div>
                    <button onClick={() => {navigator.clipboard.writeText(shareLink)}} className="shrink-0 z-10 inline-flex items-center py-3 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-e-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 border border-blue-700 dark:border-blue-600 hover:border-blue-800 dark:hover:border-blue-700" type="button">
                        <span id="default-icon">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z"/>
                            </svg>
                        </span>
                        <span id="success-icon" className="hidden">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                            </svg>
                        </span>
                    </button>
                    <div id="tooltip-website-url" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700">
                        <span id="default-tooltip-message">Copy link</span>
                        <span id="success-tooltip-message" className="hidden">Copied!</span>
                        <div className="tooltip-arrow" data-popper-arrow></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <QrCode className="w-16 h-16 text-gray-400" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Generating a QR code
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <ul className="divide-y divide-gray-200">
        {usersMetadata.map((item,index) => (
          <li key={index} className="p-4 flex items-center justify-between space-x-4 border">
            <span className="text-gray-700">{item.user}</span>
            <div className="flex space-x-2">
              <button
                className="bg-green-500 hover:bg-green-600"
                onClick={() => allowPermission(item)}
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                className="bg-red-500 hover:bg-red-600"
                onClick={() => removePermission(item)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default ShareFile
