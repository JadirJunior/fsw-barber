"use client"

import React, { useEffect, useState } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel"
import { Barbershop } from "@prisma/client"
import BarbershopItem from "./barbershop-item"

interface CarouselItemProps {
  barbershops: Barbershop[]
}

const CustomCarousel = ({ barbershops }: CarouselItemProps) => {
  const [isCarousel, setIsCarousel] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsCarousel(window.innerWidth >= 768)
    }

    handleResize()

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      {isCarousel ? (
        <Carousel>
          <CarouselPrevious />
          <CarouselContent>
            {barbershops.map((barbershop) => (
              <CarouselItem key={barbershop.id} className="basis-1/3">
                <BarbershopItem barbershop={barbershop} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselNext />
        </Carousel>
      ) : (
        <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      )}
    </>
  )
}

export default CustomCarousel
