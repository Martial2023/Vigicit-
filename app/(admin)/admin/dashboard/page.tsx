'use client'
import { getReportStats } from '@/app/(actions)/actions'
import { ReportProps, ReportStatProps, ReportStatusProps } from '@/types'
import React, { useEffect, useState, useMemo } from 'react'
import { toast } from 'sonner'
import MinLoader from '@/components/MinLoader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const Map = dynamic(() => import('@/components/Map'), { 
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
            <MinLoader />
        </div>
    )
})
import {
    FileText,
    Clock,
    PlayCircle,
    CheckCircle,
    Search,
    Download,
    Eye,
    Share2,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'

const statusConfig: Record<ReportStatusProps, { label: string; color: string }> = {
    SUBMITTED: { label: 'Soumis', color: 'bg-blue-500 hover:bg-blue-600' },
    IN_PROGRESS: { label: 'En cours', color: 'bg-yellow-500 hover:bg-yellow-600' },
    RESOLVED: { label: 'Résolu', color: 'bg-green-500 hover:bg-green-600' },
    REJECTED: { label: 'Rejeté', color: 'bg-red-500 hover:bg-red-600' }
}

const DashboardPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [data, setData] = useState<ReportStatProps | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [categoryFilter, setCategoryFilter] = useState<string>('all')
    const [currentPage, setCurrentPage] = useState<number>(1)
    const itemsPerPage = 6

    const fetchData = async () => {
        try {
            setIsLoading(true)
            const response = await getReportStats()
            setData(response)
        } catch (error) {
            toast.error("Une erreur est survenue lors de la récupération des statistiques.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const filteredReports = useMemo(() => {
        if (!data?.reports) return []

        let filtered = [...data.reports]

        // Filtre par recherche
        if (searchQuery) {
            filtered = filtered.filter(report =>
                report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                report.id.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }

        // Filtre par statut
        if (statusFilter !== 'all') {
            filtered = filtered.filter(report => report.status === statusFilter)
        }

        // Filtre par catégorie
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(report => report.categoryName === categoryFilter)
        }

        return filtered
    }, [data?.reports, searchQuery, statusFilter, categoryFilter])

    const paginatedReports = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return filteredReports.slice(startIndex, endIndex)
    }, [filteredReports, currentPage])

    const totalPages = Math.ceil(filteredReports.length / itemsPerPage)

    const categories = useMemo(() => {
        if (!data?.reports) return []
        const uniqueCategories = [...new Set(data.reports.map(r => r.categoryName))]
        return uniqueCategories
    }, [data?.reports])

    const handleExportCSV = () => {
        if (!data?.reports) return

        const headers = ['ID', 'Titre', 'Catégorie', 'Statut', 'Date', 'Adresse']
        const csvData = data.reports.map(report => [
            report.id,
            report.title,
            report.categoryName,
            statusConfig[report.status].label,
            report.date ? new Date(report.date).toLocaleDateString('fr-FR') : '',
            report.address
        ])

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `signalements_${new Date().toISOString().split('T')[0]}.csv`
        link.click()
    }

    const handleShare = async (report: ReportProps) => {
        try {
            const url = `${window.location.origin}/report/${report.id}`
            if (navigator.share) {
                await navigator.share({
                    title: report.title,
                    text: report.description,
                    url: url
                })
            } else {
                await navigator.clipboard.writeText(url)
                toast.success("Lien copié dans le presse-papier")
            }
        } catch (error) {
            toast.error("Erreur lors du partage")
        }
    }

    if (isLoading) {
        return (
            <main className='min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center'>
                <div className="flex flex-col items-center gap-4">
                    <MinLoader />
                    <p className="text-zinc-600 dark:text-zinc-400">Chargement du tableau de bord...</p>
                </div>
            </main>
        )
    }

    if (!data) {
        return (
            <main className='min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center'>
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                        Erreur de chargement
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                        Impossible de charger les données du tableau de bord.
                    </p>
                    <Button onClick={fetchData}>Réessayer</Button>
                </div>
            </main>
        )
    }

    return (
        <main className='min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 md:px-6 lg:px-8'>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white">
                        Tableau de bord administratif
                    </h1>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <Card className="border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                Total des signalements
                            </CardTitle>
                            <FileText className="h-5 w-5 text-zinc-400 dark:text-zinc-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                                {data.totalReports}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                Signalements ouverts
                            </CardTitle>
                            <Clock className="h-5 w-5 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                                {data.reportsByStatus.SUBMITTED || 0}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                Signalements en cours
                            </CardTitle>
                            <PlayCircle className="h-5 w-5 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                                {data.reportsByStatus.IN_PROGRESS || 0}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                Signalements résolus
                            </CardTitle>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                                {data.reportsByStatus.RESOLVED || 0}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Map View */}
                <Card className="border-zinc-200 dark:border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-zinc-900 dark:text-white">
                            Vue carte administrative
                        </CardTitle>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Visualisation des signalements avec couches administratives
                        </p>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
                            <Map
                                coordinates={data.reports.map(r => r.geoLocation)}
                                zoom={6}
                                className="w-full h-full"
                            />
                        </div>
                        <div className="mt-4">
                            <Button className="bg-blue-500 hover:bg-blue-600">
                                Données en temps réel
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Reports Table */}
                <Card className="border-zinc-200 dark:border-zinc-800">
                    <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <CardTitle className="text-xl font-bold text-zinc-900 dark:text-white">
                                Tous les signalements
                            </CardTitle>
                            <Button
                                onClick={handleExportCSV}
                                variant="outline"
                                className="w-full md:w-auto"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Export CSV
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Filtres */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                <Input
                                    placeholder="Rechercher un signalement..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className='w-full cursor-pointer'>
                                    <SelectValue placeholder="Statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les statuts</SelectItem>
                                    <SelectItem value="SUBMITTED">Soumis</SelectItem>
                                    <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                                    <SelectItem value="RESOLVED">Résolu</SelectItem>
                                    <SelectItem value="REJECTED">Rejeté</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className='w-full cursor-pointer'>
                                    <SelectValue placeholder="Catégorie" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes les catégories</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Table */}
                        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-zinc-100 dark:bg-zinc-900">
                                    <TableRow>
                                        <TableHead className="font-semibold">ID</TableHead>
                                        <TableHead className="font-semibold">Titre</TableHead>
                                        <TableHead className="font-semibold">Catégorie</TableHead>
                                        <TableHead className="font-semibold">Statut</TableHead>
                                        <TableHead className="font-semibold">Date</TableHead>
                                        <TableHead className="font-semibold text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedReports.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-zinc-500 dark:text-zinc-400">
                                                Aucun signalement trouvé
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedReports.map((report) => (
                                            <TableRow key={report.id}>
                                                <TableCell className="font-mono text-xs text-zinc-600 dark:text-zinc-400">
                                                    {report.id.slice(0, 8)}
                                                </TableCell>
                                                <TableCell className="font-medium text-zinc-900 dark:text-white">
                                                    {report.title}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                                                        {report.categoryName}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`${statusConfig[report.status].color} text-white border-0`}>
                                                        {statusConfig[report.status].label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-zinc-600 dark:text-zinc-400">
                                                    {report.date ? new Date(report.date).toLocaleDateString('fr-FR', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit'
                                                    }) : '-'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link href={`/report/${report.id}`}>
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleShare(report)}
                                                        >
                                                            <Share2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                    Affichage de {((currentPage - 1) * itemsPerPage) + 1} à{' '}
                                    {Math.min(currentPage * itemsPerPage, filteredReports.length)} sur{' '}
                                    {filteredReports.length} signalements
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        <span className="hidden sm:inline ml-2">Précédent</span>
                                    </Button>
                                    <span className="text-sm text-zinc-600 dark:text-zinc-400 px-2">
                                        Page {currentPage} sur {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        <span className="hidden sm:inline mr-2">Suivant</span>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}

export default DashboardPage