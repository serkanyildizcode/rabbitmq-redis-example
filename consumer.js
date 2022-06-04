const amqp = require("amqplib")
const data = require('./data.json')
const queueName = process.argv[2] || "jobsQueue";
const redis = require('ioredis')
const client = redis.createClient()
connect_rabbitmq();


async function connect_rabbitmq(){
    try{
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const assertion = await channel.assertQueue(queueName)
    

console.log("Mesaj bekleniyor");
    channel.consume(queueName,message=>{
      const messageInfo = JSON.parse(message.content.toString())
     

      const userInfo = data.find(u => u.id == messageInfo.description)
   
      if (userInfo) {
        console.log("İslenen kayıt :", userInfo);
          client.set(`user_${userInfo.id}`,JSON.stringify(userInfo),(err,data) =>{
              if(!err){
                console.log("Status :",data)
                channel.ack(message)
              } 
          })

        
      }
      
    })

    }catch(e){
        console.log("error",e);
    }

    


}