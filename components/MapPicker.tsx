'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { MapPin } from 'lucide-react'

// Import dynamique pour éviter les erreurs SSR avec Leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
// useMapEvents is a hook, not a component, so it's imported directly
import { useMapEvents } from 'react-leaflet'
import MinLoader from './MinLoader'
import { toast } from 'sonner'

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void
  initialPosition?: { lat: number; lng: number }
}

const MapPicker = ({ onLocationSelect, initialPosition }: MapPickerProps) => {
  const [position, setPosition] = useState<[number, number] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Composant pour gérer les clics sur la carte
  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng
        setPosition([lat, lng])
        onLocationSelect(lat, lng)
        toast.info(`Position sélectionnée : [${lat.toFixed(5)}, ${lng.toFixed(5)}]`)
        map.flyTo(e.latlng, map.getZoom())
      },
    })

    return position ? <Marker position={position} /> : null
  }

  useEffect(() => {
    // Géolocalisation de l'utilisateur
    if (initialPosition) {
      setPosition([initialPosition.lat, initialPosition.lng])
      setLoading(false)
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          setPosition([lat, lng])
          onLocationSelect(lat, lng)
          setLoading(false)
        },
        (err) => {
          console.error('Erreur de géolocalisation:', err)
          // Position par défaut (Cotonou, Bénin)
          setPosition([6.3654, 2.4183])
          toast.error('Impossible d\'obtenir votre position. Position par défaut utilisée.')
          setLoading(false)
        }
      )
    } else {
      // Navigateur ne supporte pas la géolocalisation
      setPosition([6.3654, 2.4183])
      toast.error('La géolocalisation n\'est pas supportée par votre navigateur.')
      setLoading(false)
    }
  }, [initialPosition, onLocationSelect])

  if (loading) {
    return (
      <div className="w-full h-[400px] rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 p-3">
          <MinLoader />
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Chargement de la carte...
          </p>
        </div>
      </div>
    )
  }

  if (!position) {
    return (
      <div className="w-full h-[400px] rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 flex items-center justify-center">
        <p className="text-sm text-red-600 dark:text-red-400">
          Erreur lors du chargement de la carte
        </p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-2">
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
          <MapPin className="size-4 text-amber-600 dark:text-amber-400 mt-0.5" />
          <p className="text-sm text-amber-700 dark:text-amber-300">{error}</p>
        </div>
      )}
      
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700">
        <MapContainer
          center={position}
          zoom={13}
          className="w-full h-full"
          zoomControl={true}
        >
          {/* TileLayer avec support Dark mode */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="dark:brightness-75 dark:invert dark:contrast-[3] dark:hue-rotate-180"
          />
          <LocationMarker />
        </MapContainer>
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
        Cliquez sur la carte pour ajuster la position
      </p>
    </div>
  )
}

export default MapPicker
