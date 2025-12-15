'use server'
import { CommentProps, ReportCategoryProps, ReportFormDataProps, ReportProps, ReportStatProps, ReportStatusProps, ReportWithCommentsProps } from "@/types"
import { getUser } from "@/lib/auth-session"
import prisma from "@/lib/prisma"


export async function getReportCategories(): Promise<ReportCategoryProps[]> {
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                description: true
            }
        })
        return categories
    } catch (error) {
        console.log("Erreur lors de la récupération des catégories de signalement :", error);
        throw new Error('Erreur lors de la récupération des catégories de signalement');
    }
}

export async function submitReport(data: ReportFormDataProps) {
    try {
        const user = await getUser()
        if (!user) {
            throw new Error('Utilisateur non authentifié')
        }

        const report = await prisma.report.create({
            data: {
                title: data.title,
                categoryId: data.categoryId,
                description: data.description,
                address: data.address,
                geoLocation: [data.geoLocation.latitude, data.geoLocation.longitude],
                date: data.date ?? new Date(),
                contact: data.contact,
                images: data.images,
                status: data.status,
                userId: user.id
            }
        })
        return report
    } catch (error) {
        console.log("Erreur lors de la soumission du rapport :", error);
        throw new Error('Erreur lors de la soumission du rapport');
    }
}


export async function getUserReports(): Promise<ReportProps[]> {
    try {
        const user = await getUser()
        if (!user) {
            throw new Error('Utilisateur non authentifié ou non autorisé')
        }
        const reports = await prisma.report.findMany({
            where: {
                userId: user.id
            },
            include: {
                category: true
            }
        })
        const userReports = reports.map((report) => ({
            ...report,
            categoryName: report.category.name,
            geoLocation: {
                latitude: Number(report.geoLocation[0]),
                longitude: Number(report.geoLocation[1])
            }
        }))
        return userReports
    } catch (error) {
        console.log("Erreur lors de la récupération des signalements de l'utilisateur :", error);
        throw new Error('Erreur lors de la récupération des signalements de l\'utilisateur');
    }
}

export async function getReports(): Promise<ReportProps[]> {
    try {
        const reports = await prisma.report.findMany({
            include: {
                category: true
            }
        })
        const userReports = reports.map((report) => ({
            ...report,
            categoryName: report.category.name,
            geoLocation: {
                latitude: Number(report.geoLocation[0]),
                longitude: Number(report.geoLocation[1])
            }
        }))
        return userReports
    } catch (error) {
        console.log("Erreur lors de la récupération des signalements de l'utilisateur :", error);
        throw new Error('Erreur lors de la récupération des signalements de l\'utilisateur');
    }
}

export async function getReportById(reportId: string): Promise<ReportWithCommentsProps | null> {
    try {
        if (!reportId) {
            throw new Error('ID de signalement invalide')
        }
        const report = await prisma.report.findUnique({
            where: {
                id: reportId
            },
            include: {
                category: true,
                comments: {
                    include: {
                        user: true
                    }
                }
            }
        })
        if (!report) {
            throw new Error('Signalement non trouvé')
        }
        return {
            ...report,
            categoryName: report.category.name || '',
            geoLocation: {
                latitude: Number(report.geoLocation[0]),
                longitude: Number(report.geoLocation[1])
            },
            comments: report.comments.map(comment => ({
                ...comment,
                user: comment.user.name,
                userImage: comment.user.image
            }))
        }
    } catch (error) {
        console.log("Erreur lors de la récupération du signalement :", error);
        throw new Error('Erreur lors de la récupération du signalement');
    }
}


export async function commentReport(reportId: string, content: string): Promise<CommentProps> {
    try {
        const connectedUser = await getUser()
        if(!connectedUser){
            throw new Error("Utilisateur non authentifié");
        }
        if(!reportId || !content.trim()){
            throw new Error("Données de commentaire invalides");
        }
        const comment = await prisma.comment.create({
            data: {
                userId: connectedUser.id,
                reportId: reportId,
                content: content.trim()
            }
        })
        return {
            ...comment,
            user: connectedUser.name,
            userImage: connectedUser.image || ''
        }
    } catch (error) {
        console.log("Erreur lors de l'ajout du commentaire au signalement :", error);
        throw new Error("Erreur lors de l'ajout du commentaire au signalement");
    }
}


export async function getReportStats(): Promise<ReportStatProps> {
    try {
        const connectedUser = await getUser()
        if(!connectedUser || !connectedUser.role || connectedUser.role !== 'ADMIN'){
            throw new Error("Utilisateur non autorisé");
        }

        const reports = await prisma.report.findMany({
            include: {
                category: true
            }
        })

        const formattedReports: ReportProps[] = reports.map(report => ({
            ...report,
            categoryName: report.category.name,
            geoLocation: {
                latitude: Number(report.geoLocation[0]),
                longitude: Number(report.geoLocation[1])
            }
        }));

        return {
            reports: formattedReports,
            totalReports: reports.length,
            reportsByStatus: reports.reduce((acc, report) => {
                const status = report.status;
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            }, {} as Record<ReportStatusProps, number>)
        }
    } catch (error) {
        console.log("Erreur lors de la récupération des statistiques des signalements :", error);
        throw new Error('Erreur lors de la récupération des statistiques des signalements');
    }
}


type AddCategoryData = {
    name: string
    description?: string
}
export async function addReportCategory(data: AddCategoryData): Promise<ReportCategoryProps> {
    try {
        const connectedUser = await getUser()
        if(!connectedUser || !connectedUser.role || connectedUser.role !== 'ADMIN'){
            throw new Error("Utilisateur non autorisé");
        }

        const category = await prisma.category.create({
            data: {
                name: data.name,
                description: data.description || null
            }
        })
        return category
    } catch (error) {
        console.log("Erreur lors de l'ajout de la catégorie de signalement :", error);
        throw new Error("Erreur lors de l'ajout de la catégorie de signalement");
    }
}