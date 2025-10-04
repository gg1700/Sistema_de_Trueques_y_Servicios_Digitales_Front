import Image from "next/image"

export default function Page() {
  return (
    <div>
      <Image src="/next.svg" alt="Profile" width={100} height={100} />
      <Image src="/globe.svg" alt="bullshit" width={100} height={100} />
    </div>
  )
}