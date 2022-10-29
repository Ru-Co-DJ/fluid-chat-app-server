import mongoose from "mongoose"
import { Users } from "../models/users.js"

export const createUser = async (req,res)=>{
    const account = req.body.account
    let acc = {...account,friends:[],discussions:[]}
    const newUser = Users(acc)
    
    try {
        await newUser.save()
        res.json({name:newUser.name,phone:newUser.phone,friends:newUser.friends})
    } catch (error) {
        console.log(error)
        res.json(null)
    }
}

export const login= async(req,res) => {
    const account = req.body.account
    try {
        const [profile] = await Users.find({$and: [{email:account.email},{password:account.password}]});
        profile ? res.json({
            name:profile.name,
            phone:profile.phone,
            email:profile.email,
            friends:remove(profile.friends),
            requestedRooms:profile.requestedRooms,
            rooms:profile.rooms
        }) : res.json(null);

    } catch (error) {
        console.log(error) 
        res.json(null);
    }
}


export const addFriend = async (req,res)=>{
    const newFriend = req.body.newFriend;
    const myPhone = req.body.myPhone;
    try {
        const [user] = await Users.find({phone:myPhone});
        const [friend] = await Users.find({phone:newFriend.phone})
        if(friend){
            if(user && !user.friends.find(e=>e.phone === newFriend.phone)){
                await Users.updateOne(
                    {phone:myPhone},
                    {$push: {friends:{name:newFriend.name,phone:newFriend.phone}}}
                )
                const [newAcc] = await Users.find({phone:myPhone})
                res.json(remove(newAcc.friends))
            }else{
                res.json(null)
            }
        }
        else res.json(null);
    } catch (error) {
        console.log(error);
        res.json(null);
    }
}


export const deleteContact = async (req,res)=>{
    const data = req.body.data;
    try {
        const [me]=await Users.find({phone:data.myPhone});
        if(me){
            await Users.updateOne(
                {phone:data.myPhone},
                {$pull:{friends:{phone:data.recPhone}}}
            )
        
            
            const [newAcc] = await Users.find({phone:data.myPhone})
            res.json(remove(newAcc.friends))
        }

        else res.json(null)
    } catch (error) {
        console.log(error)
        res.json(null)
    }
}




function remove(friends){
    return friends.map(e=>{
        return {name:e.name,phone:e.phone}
    })
}

