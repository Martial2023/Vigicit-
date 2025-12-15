'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ReportStatusProps, ReportWithCommentsProps } from '@/types'
import { toast } from 'sonner'
import { getReportById } from '@/app/(actions)/actions'
import MinLoader from '@/components/MinLoader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'

const Map = dynamic(() => import('@/components/Map'), { 
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 rounded-lg">
            <MinLoader />
        </div>
    )
})

import {
    ArrowLeft,
    Calendar,
    MapPin,
    Tag,
    Phone,
    Edit,
    Trash2,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    MessageSquare
} from 'lucide-react'
import AddComment from '@/components/AddComment'

const statusConfig: Record<ReportStatusProps, {
    label: string
    color: string
    bgColor: string
    icon: React.ReactNode
}> = {
    SUBMITTED: {
        label: 'Signalement Soumis',
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
        icon: <AlertCircle className="h-4 w-4" />
    },
    IN_PROGRESS: {
        label: 'En cours de traitement',
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800',
        icon: <Clock className="h-4 w-4" />
    },
    RESOLVED: {
        label: 'Problème Résolu',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
        icon: <CheckCircle2 className="h-4 w-4" />
    },
    REJECTED: {
        label: 'Rejeté',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
        icon: <XCircle className="h-4 w-4" />
    }
}

const ReportDetailPage = () => {
    const params = useParams()
    const router = useRouter()
    const reportId = params?.reportId as string
    const [isFetching, setIsFetching] = useState<boolean>(true)
    const [reportData, setReportData] = useState<ReportWithCommentsProps | null>(null)
    const [selectedImage, setSelectedImage] = useState<number>(0)

    const fetchReportData = async (id: string) => {
        try {
            setIsFetching(true)
            const response = await getReportById(id)
            setReportData(response)
        } catch (error) {
            toast.error("Erreur lors de la récupération du signalement.")
        } finally {
            setIsFetching(false)
        }
    }

    useEffect(() => {
        if (reportId) {
            fetchReportData(reportId)
        }
    }, [reportId])

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    if (isFetching) {
        return (
            <main className='min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center'>
                <div className="flex flex-col items-center gap-4">
                    <MinLoader />
                    <p className="text-zinc-600 dark:text-zinc-400">Chargement du signalement...</p>
                </div>
            </main>
        )
    }

    if (!reportData) {
        return (
            <main className='min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center'>
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                        Signalement introuvable
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                        Le signalement que vous recherchez n'existe pas ou a été supprimé.
                    </p>
                    <Button onClick={() => router.push('/my-reports')}>
                        Retour à mes signalements
                    </Button>
                </div>
            </main>
        )
    }

    return (
        <main className='min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12'>
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <div className="container mx-auto px-4 py-4 md:py-6">
                    <div className="flex items-center justify-between gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.back()}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Retour à la carte</span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 md:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Colonne principale */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Titre et statut */}
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
                                {reportData.title}
                            </h1>
                        </div>

                        {/* Galerie d'images */}
                        {reportData.images && reportData.images.length > 0 && (
                            <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800">
                                <CardContent className="p-0">
                                    <div className="relative w-full h-[400px] bg-zinc-100 dark:bg-zinc-900 rounded-xl">
                                        <Image
                                            src={reportData.images[selectedImage]}
                                            alt={reportData.title}
                                            fill
                                            className="object-cover rounded-xl"
                                        />
                                    </div>

                                    {/* Thumbnails */}
                                    {reportData.images.length > 1 && (
                                        <div className="flex gap-2 p-4 overflow-x-auto bg-white dark:bg-zinc-900">
                                            {reportData.images.map((image, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedImage(index)}
                                                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                                        ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                                                        : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                                                        }`}
                                                >
                                                    <Image
                                                        src={image}
                                                        alt={`${reportData.title} - ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Description */}
                        <Card className="border-zinc-200 dark:border-zinc-800">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
                                    Détails du Signalement
                                </h2>
                                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                                    {reportData.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Localisation */}
                        <Card className="border-zinc-200 dark:border-zinc-800">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Localisation
                                </h2>
                                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                                    {reportData.address}
                                </p>
                                <div className="rounded-lg overflow-hidden h-[300px] md:h-[400px] border border-zinc-200 dark:border-zinc-800">
                                    <Map
                                        coordinates={[{
                                            latitude: reportData.geoLocation.latitude,
                                            longitude: reportData.geoLocation.longitude
                                        }]}
                                        zoom={15}
                                        className="w-full h-full"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Commentaires */}
                        <Card className="border-zinc-200 dark:border-zinc-800">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5" />
                                        Commentaires et Mises à Jour
                                    </h2>
                                    <AddComment
                                        report={reportData}
                                        setReportData={setReportData as React.Dispatch<React.SetStateAction<ReportWithCommentsProps>>}
                                    >
                                        <Button size="sm">
                                            Commenter
                                        </Button>
                                    </AddComment>
                                </div>

                                {reportData.comments && reportData.comments.length > 0 ? (
                                    <div className="space-y-4">
                                        {reportData.comments.map((comment) => (
                                            <div
                                                key={comment.id}
                                                className="flex gap-4 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800"
                                            >
                                                <Avatar className="h-10 w-10 flex-shrink-0">
                                                    <AvatarImage src={comment.userImage || undefined} />
                                                    <AvatarFallback className="bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                                                        {getInitials(comment.user)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium text-zinc-900 dark:text-white">
                                                            {comment.user}
                                                        </span>
                                                        <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                                            il y a {Math.floor((new Date().getTime() - new Date(comment.createdAt).getTime()) / (1000 * 60 * 60 * 24))} jours
                                                        </span>
                                                    </div>
                                                    <p className="text-zinc-700 dark:text-zinc-300 text-sm">
                                                        {comment.content}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <MessageSquare className="h-12 w-12 text-zinc-400 dark:text-zinc-600 mx-auto mb-3" />
                                        <p className="text-zinc-600 dark:text-zinc-400">
                                            Aucun commentaire pour le moment
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Chronologie */}
                        <Card className="border-zinc-200 dark:border-zinc-800 sticky top-6">
                            <CardContent className="p-6">
                                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">
                                    Chronologie du Signalement
                                </h2>

                                <div className="space-y-6">
                                    {/* Statut actuel */}
                                    <div className="relative pl-6 pb-6 border-l-2 border-zinc-200 dark:border-zinc-800">
                                        <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full ${reportData.status === 'RESOLVED' ? 'bg-green-500' :
                                            reportData.status === 'IN_PROGRESS' ? 'bg-yellow-500' :
                                                reportData.status === 'REJECTED' ? 'bg-red-500' :
                                                    'bg-blue-500'
                                            } border-4 border-white dark:border-zinc-950`} />
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border mb-2 ${statusConfig[reportData.status].bgColor}`}>
                                            <span className={statusConfig[reportData.status].color}>
                                                {statusConfig[reportData.status].icon}
                                            </span>
                                            <span className={`text-sm font-medium ${statusConfig[reportData.status].color}`}>
                                                {statusConfig[reportData.status].label}
                                            </span>
                                        </div>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                            En attente
                                        </p>
                                    </div>

                                    {/* Date de signalement */}
                                    <div className="relative pl-6">
                                        <div className="absolute left-[-7px] top-0 w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                        <div className="text-sm font-medium text-zinc-900 dark:text-white mb-1">
                                            Signalement Soumis
                                        </div>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                            {reportData.date ? formatDate(reportData.date) : 'Date inconnue'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Informations */}
                        <Card className="border-zinc-200 dark:border-zinc-800">
                            <CardContent className="p-6">
                                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                                    Informations
                                </h2>

                                <div className="space-y-4">
                                    {/* Catégorie */}
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
                                            <Tag className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                                                Catégorie
                                            </p>
                                            <Badge className="bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                                                {reportData.categoryName}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Adresse */}
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                                            <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                                                Adresse
                                            </p>
                                            <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                                {reportData.address}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30">
                                            <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                                                Date de signalement
                                            </p>
                                            <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                                {reportData.date ? formatDate(reportData.date) : 'Date inconnue'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Contact */}
                                    {reportData.contact && (
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/30">
                                                <Phone className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">
                                                    Contact
                                                </p>
                                                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                                    {reportData.contact}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ReportDetailPage