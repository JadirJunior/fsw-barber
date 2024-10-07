"use client"

import { Barbershop, BarbershopService, Booking } from "@prisma/client"
import Image from "next/image"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"
import { Calendar } from "./ui/calendar"
import { ptBR } from "date-fns/locale"
import { useEffect, useMemo, useState } from "react"
import { isPast, isToday, set } from "date-fns"
import React from "react"
import { createBooking } from "../_actions/create-booking"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { getBookings } from "../_actions/get-bookings"
import { Dialog, DialogContent } from "./ui/dialog"
import SignInDialog from "./sign-in-dialog"
import BookingSummary from "./booking-summary"
import { useRouter } from "next/navigation"

interface ServiceItemProps {
  service: BarbershopService
  barbershop: Pick<Barbershop, "name">
}

interface GetTimeListProps {
  bookings: Booking[]
  selectedDate: Date
}

const TIME_LIST = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
]

const getTimeList = ({ bookings, selectedDate }: GetTimeListProps) => {
  //TODO: Não exibir horários do passado
  return TIME_LIST.filter((time) => {
    const hour = Number(time.split(":")[0])
    const minute = Number(time.split(":")[1])

    const timeIsOnThePast = isPast(
      set(new Date(), { hours: hour, minutes: minute }),
    )

    if (timeIsOnThePast && isToday(selectedDate)) {
      return false
    }

    const hasBookingOnCurrentTime = bookings.some(
      (booking) =>
        booking.date.getHours() === hour &&
        booking.date.getMinutes() === minute,
    )

    if (hasBookingOnCurrentTime) {
      return false
    }

    return true
  })
}

const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const router = useRouter()
  const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false)
  const { data } = useSession()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  )

  const [dayBookings, setDayBookings] = useState<Booking[]>([])
  const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false)

  const timeList = useMemo(() => {
    if (!selectedDate) return []
    return getTimeList({
      bookings: dayBookings,
      selectedDate,
    })
  }, [dayBookings, selectedDate])

  useEffect(() => {
    const fetchBookings = async () => {
      if (!selectedDate) return

      const bookings = await getBookings({
        date: selectedDate,
        serviceId: service.id,
      })

      setDayBookings(bookings)
    }

    fetchBookings()
  }, [selectedDate, service.id])

  const selectedDates = useMemo(() => {
    if (!selectedDate || !selectedTime) return

    return set(selectedDate, {
      minutes: Number(selectedTime.split(":")[1]),
      hours: Number(selectedTime.split(":")[1]),
    })
  }, [selectedDate, selectedTime])

  const handleBookingClick = () => {
    if (data?.user) {
      return setBookingSheetIsOpen(true)
    }

    return setSignInDialogIsOpen(true)
  }

  const handleBookingSheetOpenChange = () => {
    setSelectedDate(undefined)
    setSelectedTime(undefined)
    setDayBookings([])
    setBookingSheetIsOpen(false)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleCreateBooking = async () => {
    try {
      if (!selectedDates) return

      await createBooking({
        serviceId: service.id,
        date: selectedDates,
      })

      handleBookingSheetOpenChange()

      toast.success("Reserva criada com sucesso!", {
        action: {
          label: "Ver agendamentos",
          onClick: () => router.push("/bookings"),
        },
      })
    } catch (error) {
      console.error(error)
      toast.error("Erro ao criar reserva!")
    }
  }

  return (
    <>
      <Card>
        <CardContent className="flex items-center gap-3 p-3">
          {/* IMAGE */}
          <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
            <Image
              src={service.imageUrl}
              fill
              className="rounded-xl object-cover"
              alt={service.name}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold">{service.name}</h3>
            <p className="text-sm text-gray-400">{service.description}</p>

            {/* PREÇO E BOTÃO */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-primary">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>

              <Sheet
                open={bookingSheetIsOpen}
                onOpenChange={handleBookingSheetOpenChange}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleBookingClick}
                >
                  Reservar
                </Button>

                <SheetContent className="px-0">
                  <SheetHeader>
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <div className="border-b border-solid py-5">
                    <Calendar
                      fromDate={new Date()}
                      mode="single"
                      locale={ptBR}
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      styles={{
                        head_cell: {
                          width: "100%",
                          textTransform: "capitalize",
                        },

                        cell: {
                          width: "100%",
                        },

                        button: {
                          width: "100%",
                        },

                        nav_button_previous: {
                          width: "32px",
                          height: "32px",
                        },

                        nav_button_next: {
                          width: "32px",
                          height: "32px",
                        },

                        caption: {
                          textTransform: "capitalize",
                        },
                      }}
                    />
                  </div>

                  {selectedDate && (
                    <div className="flex gap-3 overflow-x-auto p-5 [&::-webkit-scrollbar]:hidden">
                      {timeList.length > 0 ? (
                        timeList.map((time) => (
                          <Button
                            key={time}
                            variant={
                              selectedTime === time ? "default" : "outline"
                            }
                            className="rounded-full"
                            onClick={() => handleTimeSelect(time)}
                          >
                            {time}
                          </Button>
                        ))
                      ) : (
                        <p className="text-gray-400">
                          Nenhum horário disponível
                        </p>
                      )}
                    </div>
                  )}

                  {selectedTime && selectedDate && (
                    <>
                      {selectedDates && (
                        <div className="p-5">
                          <BookingSummary
                            barbershop={barbershop}
                            service={service}
                            selectedDate={selectedDates}
                          />
                        </div>
                      )}
                      <SheetFooter className="px-5">
                        <Button type="submit" onClick={handleCreateBooking}>
                          Confirmar
                        </Button>
                      </SheetFooter>
                    </>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={signInDialogIsOpen}
        onOpenChange={(open) => setSignInDialogIsOpen(open)}
      >
        <DialogContent className="w-[90%]">
          <SignInDialog />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ServiceItem
