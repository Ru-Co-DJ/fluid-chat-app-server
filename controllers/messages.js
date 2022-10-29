import { Users } from "../models/users.js"

export const getMyMessages = async (req,res)=>{
    const myPhone = req.query.myPhone;
    const recPhone = req.query.recPhone;

    try {
        const [result] = await Users.find({phone:myPhone})
        
        if(result.discussions){
            const disc = result.discussions.find(e=>(e.members.includes(recPhone)))
            const me = disc?.messages.filter(e=>e.sender===myPhone).map(e=>({sender:e.sender,message:e.message,date:new Date(e.date).getTime()}))
            const other = disc?.messages.filter(e=>e.sender===recPhone).map(e=>({sender:e.sender,message:e.message,date:new Date(e.date).getTime()}))
            const data = {me,other}
            res.json(data)
        }
        else{
            res.json(null)
        }

    } catch (error) {
        console.log(error)
        res.json(null)
    }
}

export const sendMessage = async (req,res)=>{
    const message = req.body.message;

    try {
        const [receiver] = await Users.find({phone:message.recPhone})
        if(receiver){
            const discussions = receiver.discussions;
            let members = discussions.find(e=>e.members.includes(message.myPhone))
            if(members){
                await Users.updateOne(
                    {phone:message.recPhone},
                    {$push:{"discussions.$[i].messages":{sender:message.myPhone,message:message.data,date:new Date()}}},
                    {arrayFilters:[
                        {
                            "i._id":members._id
                        }
                    ]}
                )
            }
            else{
               await Users.updateOne(
                {phone:message.recPhone},
                {$push: {discussions:{members:[message.myPhone,message.recPhone],messages:[{sender:message.myPhone,message:message.data,date:new Date()}]}}}
               )
            }
        }
        const [Me] = await Users.find({phone:message.myPhone})
        if(Me && receiver){
            const discussions = Me.discussions;
            let members = discussions.find(e=>e.members.includes(message.recPhone))
            if(members){
                await Users.updateOne(
                    {phone:message.myPhone},
                    {$push:{"discussions.$[i].messages":{sender:message.myPhone,message:message.data,date:new Date()}}},
                    {arrayFilters:[
                        {
                            "i._id":members._id
                        }
                    ]}
                )
                
            }
            else{
                await Users.updateOne(
                    {phone:message.myPhone},
                    {$push: {discussions:{members:[message.myPhone,message.recPhone],messages:[{sender:message.myPhone,message:message.data,date:new Date()}]}}}
                )
             }
        res.json("sent")
        }
        else{
            res.json(null)
        }

    } catch (error) {
        console.log(error)
        res.json(null)
    }

}

export const deleteConv = async (req,res) =>{
    const data = req.body.data
    try {
        const [me] = await Users.find({phone:data.myPhone});
        if(me){
            const members = me.discussions.find(e=>e.members.includes(data.recPhone))
            await Users.updateOne(
                {phone:data.myPhone},
                {$pull:{discussions:{_id:members._id}}}
            )
        res.json("deleted")
        }
    } catch (error) {
        console.log(error)
        res.json(null)
        
    }
}