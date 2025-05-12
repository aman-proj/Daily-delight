import { Search } from "lucide-react";

const backend_domain ='http://localhost:3000'
const fetch_api ={
    feed_post :{
        url:`${backend_domain}/feed_posts`,
        method:'get'
    },  get_user :{
        url:`${backend_domain}/user/`,
        method:'get'
    },
    users:{
        url:`${backend_domain}/all_users`,
        method:'get'
    },
    search_user:{
        url:`${backend_domain}/search_user`,
        method:'get'
    },signup:{
        url:`http://localhost:3000/signup/`,
        method:'post'
    },login:{
        url:`http://localhost:3000/login/`,
        method:'post'
    },like:{
        url:`${backend_domain}/like`,
        method:'post'
    }
}
export default fetch_api;