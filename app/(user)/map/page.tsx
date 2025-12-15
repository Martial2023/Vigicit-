'use client'
import { getReports } from '@/app/(actions)/actions'
import MinLoader from '@/components/MinLoader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ReportProps, statusConfig } from '@/types'
import { Calendar, Eye, MapPin, Plus, Share2 } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('@/components/Map'), { 
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
            <MinLoader />
        </div>
    )
})

const page = () => {
    const [reports, setReports] = useState<ReportProps[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [sortBy, setSortBy] = useState<string>('date-desc')

    const fetchReports = async () => {
        try {
            setLoading(true)
            const response = await getReports()
            setReports(response)
        } catch (error) {
            toast.error("Erreur lors de la récupération des signalements.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReports()
    }, [])

    const filteredAndSortedReports = useMemo(() => {
        let filtered = [...reports]

        // Filtrage par statut
        if (statusFilter !== 'all') {
            filtered = filtered.filter(report => report.status === statusFilter)
        }

        // Tri
        filtered.sort((a, b) => {
            if (!a.date) return 1
            if (!b.date) return -1
            const dateA = new Date(a.date).getTime()
            const dateB = new Date(b.date).getTime()

            if (sortBy === 'date-desc') return dateB - dateA
            if (sortBy === 'date-asc') return dateA - dateB
            return 0
        })

        return filtered
    }, [reports, statusFilter, sortBy])

    const handleShare = async (report: ReportProps) => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: report.title,
                    text: report.description,
                    url: window.location.href
                })
            } else {
                await navigator.clipboard.writeText(window.location.href)
                toast.success("Lien copié dans le presse-papier")
            }
        } catch (error) {
            toast.error("Erreur lors du partage")
        }
    }

    const formatDate = (date: Date | null) => {
        if (!date) return 'Date non spécifiée'
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    if (loading) {
        return (
            <main className='min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center'>
                <div className="flex flex-col items-center gap-4">
                    <MinLoader />
                    <p className="text-muted-foreground">Chargement des signalements...</p>
                </div>
            </main>
        )
    }
    return (
        <main className='min-h-screen py-12'>
            <div className="bg-white dark:bg-zinc-800 border-b">
                <div className="container mx-auto px-4 py-6 md:py-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">
                                Signalements
                            </h1>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                                {reports.length} signalement{reports.length > 1 ? 's' : ''} au total
                            </p>
                        </div>
                        <Link href="/report">
                            <Button className="w-full md:w-auto bg-blue-500 hover:bg-blue-600">
                                <Plus className="mr-2 h-4 w-4" />
                                Nouveau signalement
                            </Button>
                        </Link>
                    </div>

                    {/* Filtres */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Tous les statuts" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                <SelectItem value="SUBMITTED">Soumis</SelectItem>
                                <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                                <SelectItem value="RESOLVED">Résolu</SelectItem>
                                <SelectItem value="REJECTED">Rejeté</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Trier par" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="date-desc">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Plus récent
                                    </div>
                                </SelectItem>
                                <SelectItem value="date-asc">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Plus ancien
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className='container mx-auto px-4 py-6 md:py-8'>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                    Carte des Signalements
                </h2>

                <div className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
                    <Map
                        coordinates={reports.map(r => r.geoLocation)}
                        zoom={6}
                        className="w-full h-full"
                    />
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 md:py-8">
                {filteredAndSortedReports.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-700 mb-4">
                            <MapPin className="h-8 w-8 text-zinc-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                            Aucun signalement trouvé
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                            {statusFilter !== 'all'
                                ? "Aucun signalement ne correspond à ce filtre."
                                : "Vous n'avez pas encore créé de signalement."}
                        </p>
                        {statusFilter === 'all' && (
                            <Link href="/report">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Créer un signalement
                                </Button>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {filteredAndSortedReports.map((report) => (
                            <Card key={report.id} className="overflow-hidden hover:shadow-lg transition-shadow p-1">
                                <CardContent className="p-0">
                                    {/* Image de la carte */}
                                    <div className="relative w-full h-48 bg-zinc-200 dark:bg-zinc-700 rounded-xl">
                                        {report.geoLocation.latitude && report.geoLocation.longitude ? (
                                            <Image
                                                src={report.images && report.images.length > 0
                                                    ? report.images[0]
                                                    : '/img1.png'
                                                }
                                                alt={report.title}
                                                fill
                                                className="object-cover rounded-xl"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <MapPin className="h-12 w-12 text-zinc-400" />
                                            </div>
                                        )}

                                        {/* Badge de statut */}
                                        <div className="absolute top-3 right-3">
                                            <Badge className={`${statusConfig[report.status].color} text-white border-0`}>
                                                {statusConfig[report.status].label}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Contenu */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg text-zinc-900 dark:text-white mb-2 line-clamp-1">
                                            {report.title}
                                        </h3>

                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                                            {formatDate(report.date)}
                                        </p>

                                        <p className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-2 mb-4">
                                            {report.description}
                                        </p>
                                    </div>
                                </CardContent>

                                <CardFooter className="p-4 pt-0 flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        asChild
                                    >
                                        <Link href={`/report/${report.id}`}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            Voir
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleShare(report)}
                                    >
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}

export default page