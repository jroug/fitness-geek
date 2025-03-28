'use client';
 
import React, {  use } from "react";
 

type Params = Promise<{ login_token: string }>

export default function MagicLoginPage(props: { params: Params }) {
    
    const params = use(props.params);
    const login_token  = params.login_token; // Extract the token from params
    console.log('login_token', login_token);
    // login and redirect

    return (
        <main className="site-content">
            <div className="fixed w-full left-0 top-10" >
                <h2 className="text-center font-bold text-2xl publish-btn-wrapper mx-auto" >Logging In...</h2>
            </div>
        </main>
    );

}

 
