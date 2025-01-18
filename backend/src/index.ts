import WebSocket,{WebSocketServer} from "ws";
import http,{ IncomingMessage } from 'http'
import { parse } from 'url';

const server = http.createServer((req,res)=>{
    res.end("hi there server running.")
})

const spaces = new Map()

const wss = new WebSocketServer({server})

let count = 0

function makeid(length:number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

wss.on('connection',(socket,req: IncomingMessage)=>{
    const query = parse(req.url || '', true).query;
    const spaceId = query["spaceId"] as string;
    console.log(spaceId)
    socket.on("error",console.error)

    socket.on("message",(data,isBinary)=>{
        const parsedData = JSON.parse(data.toString())
        if(parsedData.type === 'register' && parsedData.role === 'user' && parsedData.access === "false"){
            // spaceId = parsedData.spaceId
            const spaId = spaceId
            if(spaces.has(spaId)){
               const space = spaces.get(spaId)
               console.log(space)
               let userId:string = 'user'+makeid(7)
               space.forEach((sp:any) => {
                    const [roleData,userData,accessData,connection] = sp
                    const [roleType, role] = roleData
                    const [type, client] = connection
                    // console.log(client)
                    // console.log('socketArray:', socketArray, 'Type:', typeof socketArray);
                    if(role ==="admin"){
                        if(client != socket && client.readyState === WebSocket.OPEN){
                            client.send(JSON.stringify({ 
                                access : false,
                                user: userId
                            }))
                        }
                    }
                })
                space.add([["role", parsedData.role],["id", userId], ["access", parsedData.access],[ "con", socket]]);
            }
        }
        else if(parsedData.type === 'register' && parsedData.access === 'true'){
            // spaceId = parsedData.spaceId
            if (!spaces.has(spaceId)) {
                spaces.set(spaceId, new Set());
            }
            if(parsedData.role === 'user'){
                const space = spaces.get(spaceId)
                space.forEach((sp:any) => {
                    const [roleData,userData,accessData,connection] = sp
                    const [type, client] = connection
                    if(userData[1]===parsedData.userId){
                        accessData[1] = parsedData.access
                        if(client != socket && client.readyState === WebSocket.OPEN){
                            client.send(JSON.stringify({ 
                                responseType : 200,
                                message: 'Access Granted'
                            }))
                        }
                    }
                })
            }else{
                spaces.get(spaceId).add([["role", parsedData.role],["id",parsedData.userId], ["access", parsedData.access],[ "con", socket]]);
            }
            console.log(`User added to group: ${spaceId}`);

        }
        else if(parsedData.type === 'remove'){
            const space = spaces.get(spaceId)
            space.forEach((sp:any) => {
                const [roleData,userData,accessData,connection] = sp
                const [type, client] = connection
                if(userData[1]===parsedData.userId){
                    if(client != socket && client.readyState === WebSocket.OPEN){
                        client.send(JSON.stringify({ 
                            responseType : 404,
                            message: 'Unauthorized User'
                        }))
                        client.close(1000,'Unauthorized User')
                    }
                    space.delete(sp)
                }
            })
        }
        else if(parsedData.type === 'message'){
            const spaId = spaceId
            if(spaces.has(spaId)){
               const space = spaces.get(spaId)
               space.forEach((client:any)=>{
                    if(client != socket && client.readyState === WebSocket.OPEN){
                        client.send(data,{binary:isBinary})
                    }
               }) 
            }else {
                socket.send(JSON.stringify({ error: 'Group not found or user not registered' }));
            }
        }
    })
    
    console.log("user connected",++count)

})

server.listen(8080,()=>{
    console.log("server is running on port 8080")
})