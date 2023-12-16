'use client'
import axios from "axios"
import { FormEvent, useState } from "react"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"

export default function Home() {

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmit('');

    if (!executeRecaptcha) {
      console.log("not available to execute recaptcha")
      return;
    }

    const gRecaptchaToken = await executeRecaptcha('inquirySubmit');

    ///

    const response = await axios({
      method: "post",
      url: "/api/recaptchaSubmit",
      data: {
        gRecaptchaToken,
      },
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    });

    if (response?.data?.success === true) {
      console.log(`Success with score: ${response?.data?.score}`);
      setSubmit('ReCaptcha Verified and Form Submitted!')
    } else {
      console.log(`Failure with score: ${response?.data?.score}`);
      setSubmit("Failed to verify recaptcha! You must be a robot!")
    }

  }


  const [submit, setSubmit] = useState('')
  return (
    <main>
      <h1 className='text-xl text-center'>Nextjs 14 Recaptcha (V3) tutorial</h1>
      <br />
      <form className='flex flex-col justify-start items-center gap-4' onSubmit={handleSubmit}>
        <input type='text' placeholder='First Name' className="border p-4 rounded" />
        <input type='text' placeholder='Last Name' className="border p-4 rounded" />
        <input type='email' placeholder='Email' className="border p-4 rounded" />
        <input type="submit" className="border p-4 text-lg rounded bg-blue-500" />
      </form>
      {submit && <p className="text-lg text-center">{submit}</p>}
    </main>
  )
}
