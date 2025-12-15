'use client'
import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Coordinates {
    latitude: number
    longitude: number
}

interface MapProps {
    coordinates: Coordinates[]
    zoom?: number
    className?: string
}

// Composant pour ajuster la vue de la carte
const MapBounds = ({ coordinates }: { coordinates: Coordinates[] }) => {
    const map = useMap()

    useEffect(() => {
        if (coordinates.length === 1) {
            map.setView([coordinates[0].latitude, coordinates[0].longitude], 15)
        } else if (coordinates.length > 1) {
            const bounds = L.latLngBounds(
                coordinates.map(coord => [coord.latitude, coord.longitude])
            )
            map.fitBounds(bounds, { padding: [50, 50] })
        }
    }, [coordinates, map])

    return null
}

// Icône personnalisée pour le marqueur
const customIcon = new L.Icon({
    iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='%23ef4444' stroke='white' stroke-width='2'%3E%3Cpath d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'%3E%3C/path%3E%3Ccircle cx='12' cy='10' r='3' fill='white'%3E%3C/circle%3E%3C/svg%3E",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
})

const Map: React.FC<MapProps> = ({ coordinates, zoom = 13, className = '' }) => {
    if (coordinates.length === 0) {
        return (
            <div className={`w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 ${className}`}>
                <p className="text-zinc-500 dark:text-zinc-400">Aucune coordonnée disponible</p>
            </div>
        )
    }

    const center: [number, number] = [
        coordinates[0].latitude,
        coordinates[0].longitude
    ]

    return (
        <div className={`w-full h-full ${className}`} style={{ minHeight: '300px' }}>
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ width: '100%', height: '100%', minHeight: '300px' }}
                scrollWheelZoom={false}
                zoomControl={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {coordinates.map((coord, index) => (
                    <Marker
                        key={index}
                        position={[coord.latitude, coord.longitude]}
                        icon={customIcon}
                    >
                        <Popup>
                            Localisation du signalement
                        </Popup>
                    </Marker>
                ))}
                <MapBounds coordinates={coordinates} />
            </MapContainer>
        </div>
    )
}

export default Map

