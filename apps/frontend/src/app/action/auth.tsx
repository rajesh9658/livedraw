"use server"

import { BACKEND_URL } from "@/urlconfig"
import axios from "axios"

export async function signIn(formData: FormData) {
  // This is a mock implementation. Replace with your actual authentication logic.
  const email = formData.get("email")
  const password = formData.get("password")

  // Simulate an API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (email === "user@example.com" && password === "password") {
    return { success: true }
  } else {
    return { error: "Invalid email or password" }
  }
}

export async function signUp(formData: FormData) {
  // This is a mock implementation. Replace with your actual sign-up logic.
  const name = formData.get("name") as string
  const email = formData.get("email")
  const password = formData.get("password")
  const fname = formData.get("name")

  // Simulate an API call
  console.log(password);
 const response = await axios.post(`${BACKEND_URL}/signup`,{
  name: (name as string).split(" ")[0],
  email:email,
  password:password,
  fname:fname?.toString(),
 })

 console.log(response.status);
  // In a real application, you would validate the input and create a new user account
  if (response.status === 200) {  
    return { success: true }
  } else {
    return { error: "Invalid input" }
  }
}

