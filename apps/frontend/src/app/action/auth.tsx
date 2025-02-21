"use client"

import { BACKEND_URL } from "@/urlconfig"
import axios from "axios"
import{loginschema,userschema} from "@repo/zod-types/types";

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string | null
  const password = formData.get("password") as string | null

 
  const parsedData = loginschema.safeParse({email,password})
  if (!parsedData.success) {
    return { error: parsedData.error.errors.map((err)=> err.message).join(", ") }
  }

  try {
    const response = await axios.post(`${BACKEND_URL}/signin`, {
      email: parsedData.data.email,
      password: parsedData.data.password
    })
    // console.log(response.status)
    if (response.data &&response.data.token) {
      localStorage.setItem("token",response.data.token);
      return { success: true }
    } else {
      return { error: "Invalid email or password" }
    }
  } catch (error) {
    console.error(error)
    return { error: "invalid email or password" }
  }
}


export async function signUp(formData: FormData) {
  const fname = formData.get("name") as string | null
  const email = formData.get("email") as string | null
  const password = formData.get("password") as string | null
  const name =fname?.trim().split(" ")[0].toString()

  // console.log(name,email,password,fname)
  const parsedData = userschema.safeParse({name,email,password,fname})
  if (!parsedData.success) {
    console.log(parsedData.error.errors)
    return { error: parsedData.error.errors.map((err)=> err.message).join(", ") }
  }

  // console.log(parsedData.data)
  try {
    const response = await axios.post(`${BACKEND_URL}/signup`, {
     name: parsedData.data.name,
     email: parsedData.data.email,
     password: parsedData.data.password,
     fname: parsedData.data.fname
    })
    if (response.data) {
      return { success: true }
    } else {
      return { error: "Sign-up failed" }
    }
  } catch (error) {
    console.error(error)
    return { error: "An error occurred during sign-up" }
  }
}
