import http from './httpService';
import { serverUrl } from '../config.json';
import { toast } from 'react-toastify';


const apiEndPoint = serverUrl + '/api';
const tokenKey = "roomKey";
const tokenID = "roomID";
const tokenname = "name";


export async function createRoom(name){
    try{
        const token = await getUnique();
        const  { data } = await http.post(apiEndPoint + '/createRoom' , {name,token});
        
        name = name.charAt(0).toUpperCase() + name.slice(1);
        setKey(tokenKey,data.roomKey);
        setKey(tokenID,data.roomID);
        setKey(tokenname,name);

        return data;
    }catch(err){
        toast.error('something went wrong');
        return null;
    }
}


export async function joinRoom(name,id,key){
    try{
        const { data } = await http.post(apiEndPoint + '/joinRoom' , { roomId:id,roomKey:key });
        if(data){
            name = name.charAt(0).toUpperCase() + name.slice(1);

            setKey(tokenKey,key);
            setKey(tokenID,id);
            setKey(tokenname,name);
        }
        return data;

    }catch(err){
        if(err.status === 401){
            // console.log(err);
        }
        return null;
    }
}


export async function joinexRoom(){
    const key = getKey(tokenKey);
    const room = getKey(tokenID);
    const name = getKey(tokenname);
    const token = getUnique();

    console.log(key+' => '+room+' => '+name+' => '+token);

    if(key && room && name){
        let is_join = await joinRoom(name,room,key);
        if(is_join){
            return {key,room,name,token};
        }
    }
    return false;
}


export function setKey(token,key){
    localStorage.setItem(token,key);
}


export function getKey(token){
    return localStorage.getItem(token);
}


export function getUnique(){
    if(localStorage.getItem('token')) return localStorage.getItem('token');

    const random_num = Math.floor(10000000000 + Math.random() * 90000000000);
    localStorage.setItem('token',random_num);
    return random_num;
}


