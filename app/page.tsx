import Header from "./_components/header"
import { Button } from "./_components/ui/button"
import Image from "next/image"
import { db } from "./_lib/prisma"
import BarbershopItem from "./_components/barbershop-item"
import { quickSearchOptions } from "./_constants/search"
import BookingItem from "./_components/booking-item"
import Search from "./_components/search"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "./_lib/auth"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import React, { useEffect, useState } from "react"
import { getConfirmedBookings } from "./_data/get-confirmed-bookings"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./_components/ui/carousel"
import CustomCarousel from "./_components/custom-carousel"

export default async function Home() {
  const session = await getServerSession(authOptions)
  const barbershops = await db.barbershop.findMany({})
  const popularBarberShops = await db.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
  })

  const confirmedBookings = await getConfirmedBookings()

  return (
    <div>
      <Header />

      <div className="md:flex md:w-full md:flex-col md:items-center">
        <div className="p-5 md:w-[80%]">
          {/* Texto */}
          <h2 className="text-xl font-bold">
            Olá,{" "}
            {session?.user ? session.user.name?.split(" ")[0] : "bem vindo"}
          </h2>
          <p>
            <span className="capitalize">
              {format(new Date(), "EEEE, dd", { locale: ptBR })}
            </span>
            <span>&nbsp;de&nbsp;</span>
            <span className="capitalize">
              {format(new Date(), "MMMM", { locale: ptBR })}
            </span>
          </p>
          {/* Busca */}
          <div className="mt-6">
            <Search />
          </div>

          {/* BUSCA RÁPIDA */}
          <div className="mt-6 flex gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
            {quickSearchOptions.map((option) => (
              <Button
                asChild
                key={option.title}
                className="gap-2"
                variant="secondary"
              >
                <Link href={`/barbershops?service=${option.title}`}>
                  <Image
                    src={option.imageUrl}
                    width={16}
                    height={16}
                    alt={option.title}
                  />
                  {option.title}
                </Link>
              </Button>
            ))}
          </div>

          {/* Banner */}
          <div className="relative mt-6 h-[150px] w-full md:h-[450px]">
            <Image
              alt="Agende nos melhores com FSW Barber"
              src="/banner-01.png"
              fill
              className="rounded-xl object-cover md:object-cover"
            />
          </div>

          {/* AGENDAMENTOS */}
          {confirmedBookings.length > 0 && (
            <>
              <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
                Agendamentos
              </h2>

              {/* TODO: Trocar por um carrossel */}
              <div className="flex gap-3 overflow-auto [&::-webkit-scrollbar]:hidden">
                {confirmedBookings.map((booking) => (
                  <BookingItem
                    key={booking.id}
                    booking={JSON.parse(JSON.stringify(booking))}
                  />
                ))}
              </div>
            </>
          )}

          <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
            Recomendados
          </h2>

          <CustomCarousel barbershops={barbershops} />

          <h2 className="mb-3 mt-6 text-xs font-bold uppercase text-gray-400">
            Populares
          </h2>

          <CustomCarousel barbershops={popularBarberShops} />
        </div>
      </div>
    </div>
  )
}
