"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"

interface OrderFiltersProps {
  phoneFilter: string
  setPhoneFilter: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
  /** rango APLICADO */
  dateRange: DateRange | undefined
  /** set aplicado (lo llama el botón Filtrar) */
  setDateRange: (range: DateRange | undefined) => void
  onClearFilters: () => void
}

export default function OrderFilters({
  phoneFilter,
  setPhoneFilter,
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange,
  onClearFilters,
}: OrderFiltersProps) {
  const [draftRange, setDraftRange] = useState<DateRange | undefined>(dateRange)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setDraftRange(dateRange)
  }, [dateRange])

  const appliedLabel =
    dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, "dd/MM/yyyy", { locale: es })} – ${format(dateRange.to, "dd/MM/yyyy", { locale: es })}`
      : dateRange?.from
      ? `${format(dateRange.from, "dd/MM/yyyy", { locale: es })} – ...`
      : "Seleccionar fechas"

  const draftLabel =
    draftRange?.from && draftRange?.to
      ? `${format(draftRange.from, "dd/MM/yyyy", { locale: es })} – ${format(draftRange.to, "dd/MM/yyyy", { locale: es })}`
      : draftRange?.from
      ? `${format(draftRange.from, "dd/MM/yyyy", { locale: es })} – ...`
      : "Seleccionar fechas"

  const handleApply = () => {
    if (draftRange?.from) { // Solo necesita from para aplicar
      setDateRange(draftRange)
      setOpen(false) // cerrar popover
    }
  }

  const isApplyDisabled = !draftRange?.from

  const handleClearDraft = () => {
    setDateRange({ from: undefined, to: undefined })
  }

  const handleTodayDraft = () => {
    const today = new Date()
    setDateRange({ from: today, to: today })
  }

  const handleLast7DaysDraft = () => {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - 6)
    setDateRange({ from: start, to: end })
  }

  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Teléfono */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Filtrar por teléfono o DNI
          </label>
          <Input
            placeholder="Número de teléfono o DNI"
            value={phoneFilter}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '')
              setPhoneFilter(value)
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full"
          />
        </div>

        {/* Fecha (rango) */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Filtrar por fecha
          </label>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                title={draftLabel} // Tooltip que muestra el rango borrador
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateRange?.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span className="truncate">{draftLabel}</span>
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="range"
                selected={draftRange}
                onSelect={(range) => setDraftRange(range)}
                initialFocus
                classNames={{
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                  day_range_start:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  day_range_end:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  day_range_middle:
                    "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground",
                }}
              />

              <div className="flex justify-end gap-2 p-2">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="text-sm"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleApply}
                  disabled={isApplyDisabled}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none text-sm"
                >
                  Filtrar
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Atajos → modifican el borrador, no aplican hasta tocar Filtrar */}
          <div className="mt-2 flex gap-2 flex-wrap">
            <Button
              variant="ghost"
              onClick={handleClearDraft}
              className="hover:bg-gray-200 text-xs"
            >
              Limpiar
            </Button>
            <Button
              variant="ghost"
              onClick={handleTodayDraft}
              className="hover:bg-gray-200 text-xs"
            >
              Hoy
            </Button>
            <Button
              variant="ghost"
              onClick={handleLast7DaysDraft}
              className="hover:bg-gray-200 text-xs"
            >
              Últimos 7 días
            </Button>
          </div>
        </div>

        {/* Estado */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">Estado</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="En Proceso">En Proceso</SelectItem>
              <SelectItem value="Pagado">Pagado</SelectItem>
              <SelectItem value="Completado">Completado</SelectItem>
              <SelectItem value="Cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-center md:justify-end">
        <Button variant="outline" onClick={onClearFilters} className="w-full md:w-auto bg-transparent">
          Limpiar Filtros
        </Button>
      </div>
    </div>
  )
}
