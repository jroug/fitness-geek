'use client';
 
import React, { use, useEffect } from "react";
 

type Params = Promise<{ login_token: string }>

export default function MagicLoginPage(props: { params: Params }) {
    
    const params = use(props.params);
    const login_token  = params.login_token; // Extract the token from params
    // console.log('login_token', login_token);
    // login and redirect


    useEffect(() => {
        const magic_login = async () => {
            const res = await fetch(`/api/magic-login?login_token=${login_token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });


            if (res.ok) {
                const data = await res.json();
                // const { message, redirect_url } = data;
                const { redirect_url } = data;
                window.location.href = redirect_url;
            } else {
                console.error('Login failed');
            }
        }
        magic_login();
    }, [login_token]);

    return (
        <main className="site-content">
            <div className="fixed w-full left-0 top-10" >
                <h2 className="text-center font-bold text-2xl publish-btn-wrapper mx-auto" >Logging In...</h2>
            </div>
        </main>
    );

}

 
