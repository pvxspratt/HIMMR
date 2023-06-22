import React from 'react'
import axios from "axios";


const backendinstance = axios.create({
    baseURL:"http://127.0.0.1:8000",
    proxy:{
        host:"http://127.0.0.1:8000"
    }
});

export default backendinstance