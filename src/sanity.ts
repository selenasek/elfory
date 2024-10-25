import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'


export const client = createClient({
  projectId: '69jp0i2w',
  dataset: 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2023-05-03', // use current date (YYYY-MM-DD) to target the latest API version
  token: "" // Only if you want to update content with the client
})

const imageBuilder = imageUrlBuilder(client)


export async function getToys() {
  const toys = await client.fetch('*[_type == "toy"]')
  return toys.map((toy: any) => ({
    id: toy._id,
    image: imageBuilder.image(toy.articleImage).size(200, 200).url(),
    __data: toy
  })) as {
    id: string;
    image: string;
    __data: any;
  }[]
}

export async function getElfs() {
  const elfs = await client.fetch('*[_type == "elf"]')

  return elfs.map((elf: any) => ({
    id: elf._id,
    name: elf.name,
    role: elf.role,
    score: elf.score,
    __data: elf
  })) as {
    id: string;
    name: string;
    role: string;
    score: number;
    __data: any;
  }[]
}

export async function updateElfScore(_id: string, score: number) {
  const result = await client.patch(_id).set({ score }).commit()
  return result
}