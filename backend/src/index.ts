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
               space.forEach((sp:any) => {
                const [roleData,accessData,connection] = sp
                const [type, client] = connection
                console.log(client)
                // console.log('socketArray:', socketArray, 'Type:', typeof socketArray);

                if(client != socket && client.readyState === WebSocket.OPEN){
                    client.send(JSON.stringify({ 
                        access : false,
                        user: 'user'+makeid(7)
                    }))
                }
               })
            }
        }
        else if(parsedData.type === 'register'){
            // spaceId = parsedData.spaceId
            if (!spaces.has(spaceId)) {
                spaces.set(spaceId, new Set());
            }
            spaces.get(spaceId).add([["role", parsedData.role], ["access", parsedData.access],[ "con", socket]]);
            console.log(`User added to group: ${spaceId}`);
        }
        else if(parsedData.type === 'message'){
            // console.log(parsedData)
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

    // socket.send('Hello from server')

    console.log("user connected",++count)

})

server.listen(8080,()=>{
    console.log("server is running on port 8080")
})